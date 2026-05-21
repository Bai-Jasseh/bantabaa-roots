
CREATE TABLE public.project_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  author_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_comments_project ON public.project_comments(project_id, created_at DESC);

ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments publicly readable" ON public.project_comments FOR SELECT USING (true);
CREATE POLICY "Authors create comments" ON public.project_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own comments" ON public.project_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own comments" ON public.project_comments FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER tg_project_comments_updated_at
BEFORE UPDATE ON public.project_comments
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
