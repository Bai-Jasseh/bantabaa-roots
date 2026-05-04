-- Storage buckets
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('project-covers', 'project-covers', true)
on conflict (id) do nothing;

-- Storage policies (path: {user_id}/filename)
create policy "Avatars publicly viewable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Project covers publicly viewable"
  on storage.objects for select
  using (bucket_id = 'project-covers');

create policy "Users upload own project cover"
  on storage.objects for insert
  with check (bucket_id = 'project-covers' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users update own project cover"
  on storage.objects for update
  using (bucket_id = 'project-covers' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own project cover"
  on storage.objects for delete
  using (bucket_id = 'project-covers' and auth.uid()::text = (storage.foldername(name))[1]);

-- Notifications table
create type public.notification_kind as enum ('reply', 'collab_interest', 'new_opportunity', 'mention', 'system');

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind notification_kind not null,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_unread on public.notifications(user_id, read, created_at desc);

alter table public.notifications enable row level security;

create policy "Users see own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

create policy "System can insert notifications"
  on public.notifications for insert
  with check (true);

-- Trigger: notify discussion author on new reply
create or replace function public.notify_on_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  d_author uuid;
  d_title text;
  d_space uuid;
  replier_name text;
begin
  select author_id, title, space_id into d_author, d_title, d_space
  from public.discussions where id = new.discussion_id;

  if d_author is null or d_author = new.author_id then
    return new;
  end if;

  select full_name into replier_name from public.profiles where id = new.author_id;

  insert into public.notifications (user_id, kind, title, body, link)
  values (
    d_author,
    'reply',
    coalesce(replier_name, 'Someone') || ' replied to your discussion',
    left(new.body, 140),
    '/discussions/' || new.discussion_id::text
  );

  return new;
end;
$$;

create trigger trg_notify_on_reply
  after insert on public.discussion_replies
  for each row execute function public.notify_on_reply();