-- ============================================
-- BANTABAA — Full backend schema
-- ============================================

-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.open_to_status AS ENUM ('work', 'freelance', 'collaboration', 'mentoring', 'not_available');
CREATE TYPE public.project_domain AS ENUM ('Fintech', 'Agritech', 'Healthtech', 'Edtech', 'Govtech', 'Open Source', 'Mobile', 'AI/ML', 'Cybersecurity', 'Blockchain', 'E-commerce', 'Other');
CREATE TYPE public.project_stage AS ENUM ('idea', 'in_progress', 'launched');
CREATE TYPE public.opportunity_type AS ENUM ('Job', 'Contract', 'Grant', 'Mentorship');
CREATE TYPE public.location_type AS ENUM ('Remote', 'Hybrid', 'On-site');
CREATE TYPE public.space_category AS ENUM ('Domain', 'Stage', 'Country');
CREATE TYPE public.discussion_type AS ENUM ('Question', 'Resource', 'Win', 'Debate', 'Announcement');
CREATE TYPE public.vote_type AS ENUM ('up', 'down');

-- ===== UTILITY: updated_at trigger =====
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ===== USER ROLES (separate table to avoid privilege escalation) =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Anyone can view roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  country TEXT,
  city TEXT,
  flag TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  avatar_hue INT DEFAULT 30,
  github_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  open_to public.open_to_status[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_profiles_handle ON public.profiles(handle);
CREATE TRIGGER tg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Auto-create profile + user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_handle TEXT;
  final_handle TEXT;
  suffix INT := 0;
BEGIN
  base_handle := lower(regexp_replace(coalesce(NEW.raw_user_meta_data->>'handle', split_part(NEW.email, '@', 1)), '[^a-z0-9]+', '-', 'g'));
  final_handle := base_handle;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE handle = final_handle) LOOP
    suffix := suffix + 1;
    final_handle := base_handle || '-' || suffix;
  END LOOP;

  INSERT INTO public.profiles (id, handle, full_name)
  VALUES (
    NEW.id,
    final_handle,
    coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== PROJECTS =====
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  builder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  lessons TEXT,
  domain public.project_domain NOT NULL DEFAULT 'Other',
  stage public.project_stage NOT NULL DEFAULT 'in_progress',
  stack TEXT[] DEFAULT '{}',
  cover_url TEXT,
  live_url TEXT,
  github_url TEXT,
  seeking_collab BOOLEAN NOT NULL DEFAULT false,
  collab_note TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_projects_builder ON public.projects(builder_id);
CREATE INDEX idx_projects_domain ON public.projects(domain);
CREATE TRIGGER tg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE POLICY "Projects are publicly readable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Builders create own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = builder_id);
CREATE POLICY "Builders update own projects" ON public.projects FOR UPDATE USING (auth.uid() = builder_id);
CREATE POLICY "Builders delete own projects" ON public.projects FOR DELETE USING (auth.uid() = builder_id);

-- ===== PROJECT REACTIONS (appreciate / discuss bookmark style) =====
CREATE TABLE public.project_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('appreciate', 'bookmark')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id, kind)
);
ALTER TABLE public.project_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reactions readable" ON public.project_reactions FOR SELECT USING (true);
CREATE POLICY "Users react as themselves" ON public.project_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own reactions" ON public.project_reactions FOR DELETE USING (auth.uid() = user_id);

-- ===== OPPORTUNITIES =====
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type public.opportunity_type NOT NULL,
  description TEXT,
  location TEXT,
  location_type public.location_type DEFAULT 'Remote',
  tags TEXT[] DEFAULT '{}',
  compensation TEXT,
  experience TEXT,
  contract_duration TEXT,
  project_type TEXT,
  mentor_slots INT,
  session_format TEXT,
  eligibility TEXT[] DEFAULT '{}',
  apply_url TEXT,
  deadline TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  logo_hue INT DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_opps_type ON public.opportunities(type);
CREATE INDEX idx_opps_deadline ON public.opportunities(deadline);
CREATE TRIGGER tg_opps_updated BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE POLICY "Opportunities publicly readable" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Posters create opps" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Posters update own opps" ON public.opportunities FOR UPDATE USING (auth.uid() = posted_by);
CREATE POLICY "Posters delete own opps" ON public.opportunities FOR DELETE USING (auth.uid() = posted_by);

-- ===== APPLICATIONS / SAVED =====
CREATE TABLE public.opportunity_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (opportunity_id, applicant_id)
);
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicants see own applications" ON public.opportunity_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Posters see applications to their opps" ON public.opportunity_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.posted_by = auth.uid())
);
CREATE POLICY "Users apply as themselves" ON public.opportunity_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Users withdraw own applications" ON public.opportunity_applications FOR DELETE USING (auth.uid() = applicant_id);

CREATE TABLE public.saved_opportunities (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, opportunity_id)
);
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own saved" ON public.saved_opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users save as themselves" ON public.saved_opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unsave own" ON public.saved_opportunities FOR DELETE USING (auth.uid() = user_id);

-- ===== SPACES =====
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  blurb TEXT,
  category public.space_category NOT NULL,
  gradient TEXT NOT NULL DEFAULT 'web',
  icon TEXT NOT NULL DEFAULT 'code',
  emoji TEXT,
  coming_soon BOOLEAN NOT NULL DEFAULT false,
  rules TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER tg_spaces_updated BEFORE UPDATE ON public.spaces FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "Spaces publicly readable" ON public.spaces FOR SELECT USING (true);
CREATE POLICY "Admins manage spaces" ON public.spaces FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== SPACE MEMBERS =====
CREATE TABLE public.space_members (
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_moderator BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (space_id, user_id)
);
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members publicly readable" ON public.space_members FOR SELECT USING (true);
CREATE POLICY "Users join as themselves" ON public.space_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave themselves" ON public.space_members FOR DELETE USING (auth.uid() = user_id);

-- ===== DISCUSSIONS =====
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.discussion_type NOT NULL DEFAULT 'Question',
  title TEXT NOT NULL,
  body TEXT,
  link_url TEXT,
  code_snippet TEXT,
  code_language TEXT,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN NOT NULL DEFAULT false,
  views INT NOT NULL DEFAULT 0,
  accepted_reply_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_discussions_space ON public.discussions(space_id);
CREATE INDEX idx_discussions_author ON public.discussions(author_id);
CREATE TRIGGER tg_discussions_updated BEFORE UPDATE ON public.discussions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE POLICY "Discussions publicly readable" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Authors create discussions" ON public.discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own discussions" ON public.discussions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own discussions" ON public.discussions FOR DELETE USING (auth.uid() = author_id);

-- ===== REPLIES =====
CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  parent_reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_replies_discussion ON public.discussion_replies(discussion_id);
CREATE TRIGGER tg_replies_updated BEFORE UPDATE ON public.discussion_replies FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE POLICY "Replies publicly readable" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Authors create replies" ON public.discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own replies" ON public.discussion_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own replies" ON public.discussion_replies FOR DELETE USING (auth.uid() = author_id);

-- ===== VOTES =====
CREATE TABLE public.discussion_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  vote public.vote_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((discussion_id IS NOT NULL)::int + (reply_id IS NOT NULL)::int = 1)
);
CREATE UNIQUE INDEX uq_vote_discussion ON public.discussion_votes(user_id, discussion_id) WHERE discussion_id IS NOT NULL;
CREATE UNIQUE INDEX uq_vote_reply ON public.discussion_votes(user_id, reply_id) WHERE reply_id IS NOT NULL;
ALTER TABLE public.discussion_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes publicly readable" ON public.discussion_votes FOR SELECT USING (true);
CREATE POLICY "Users vote as themselves" ON public.discussion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own votes" ON public.discussion_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users remove own votes" ON public.discussion_votes FOR DELETE USING (auth.uid() = user_id);

-- ===== SEED SPACES =====
INSERT INTO public.spaces (slug, name, blurb, category, gradient, icon, emoji, coming_soon) VALUES
  ('web-development', 'Web Development', 'Front-end, back-end, the whole tree.', 'Domain', 'web', 'code', '🌐', false),
  ('mobile', 'Mobile', 'iOS, Android, Flutter, React Native.', 'Domain', 'mobile', 'smartphone', '📱', false),
  ('data-ai', 'Data & AI', 'From notebooks to production models.', 'Domain', 'data', 'barchart', '🧠', false),
  ('cybersecurity', 'Cybersecurity', 'Defenders of the digital savanna.', 'Domain', 'security', 'shield', '🛡️', false),
  ('open-source', 'Open Source', 'Building in public, together.', 'Domain', 'opensource', 'gitbranch', '🌱', false),
  ('blockchain', 'Blockchain', 'Coming soon — Web3 builders welcome.', 'Domain', 'muted', 'gitbranch', '⛓️', true),
  ('beginners-corner', 'Beginners Corner', 'No question is too small here.', 'Stage', 'beginners', 'bookopen', '🌱', false),
  ('career-growth', 'Career Growth', 'Interviews, salaries, the next step.', 'Stage', 'career', 'trendingup', '🪜', false),
  ('senior-lounge', 'Senior Lounge', 'Architecture, leadership, scale.', 'Stage', 'senior', 'award', '🪑', false),
  ('the-gambia', 'The Gambia', 'Banjul, Serrekunda, Brikama and beyond.', 'Country', 'gambia', 'mappin', '🇬🇲', false),
  ('senegal', 'Senegal', 'Dakar to Saint-Louis.', 'Country', 'senegal', 'mappin', '🇸🇳', false),
  ('ghana', 'Ghana', 'Coming soon — bring your people.', 'Country', 'muted', 'mappin', '🇬🇭', true),
  ('nigeria', 'Nigeria', 'Coming soon — bring your people.', 'Country', 'muted', 'mappin', '🇳🇬', true);