
-- 1) Restrict user_roles SELECT
DROP POLICY IF EXISTS "Anyone can view roles" ON public.user_roles;

CREATE POLICY "Users view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated.
-- has_role is used in RLS policies (runs as definer regardless); safe to revoke direct execute.
-- The others are trigger functions and should not be callable directly.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_on_reply() FROM anon, authenticated, PUBLIC;

-- 3) Prevent listing of public storage buckets.
-- Public buckets remain accessible via their public CDN URLs (/storage/v1/object/public/...)
-- without needing a SELECT policy. Dropping these prevents enumerating bucket contents.
DROP POLICY IF EXISTS "Avatars publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Project covers publicly viewable" ON storage.objects;
