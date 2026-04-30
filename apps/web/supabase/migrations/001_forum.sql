-- ============================================================
-- Bytecode Forum — Migration 001
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
-- One row per auth user; populated by trigger on signup.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone."
  on profiles for select using (true);
create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill any existing users who signed up before this migration.
insert into public.profiles (id, name, avatar_url)
select id,
       raw_user_meta_data->>'name',
       raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;


-- ── Forum categories (seeded, immutable by users) ───────────
create table if not exists public.forum_categories (
  id                serial primary key,
  slug              text unique not null,
  title             text not null,
  description       text,
  "order"           int not null,
  premium_post_only boolean default false
);

alter table public.forum_categories enable row level security;
create policy "Categories are viewable by everyone."
  on forum_categories for select using (true);

insert into public.forum_categories (slug, title, description, "order", premium_post_only)
values
  ('beginner-java',     'Help — Beginner Java',               'Questions tied to Beginner track lessons',       1, false),
  ('intermediate-java', 'Help — Intermediate / Advanced Java', 'OOP, concurrency, JVM internals',               2, false),
  ('help-kotlin',       'Help — Kotlin',                      'Kotlin Bridge + Kotlin Advanced',                3, false),
  ('help-projects',     'Help — Projects',                    'Spring Boot, Android, project-specific issues',  4, false),
  ('show-and-tell',     'Show & Tell',                        'Share what you built, get feedback',             5, false),
  ('career',            'Career',                             'Job hunt, interview prep, resume reviews',       6, true),
  ('meta',              'Meta',                               'Feedback on Bytecode itself, feature requests',  7, false)
on conflict (slug) do nothing;


-- ── Forum threads ────────────────────────────────────────────
create table if not exists public.forum_threads (
  id              bigserial primary key,
  author_id       uuid references public.profiles(id) on delete set null,
  category_slug   text not null references public.forum_categories(slug),
  title           text not null check (char_length(title) between 10 and 140),
  body            text not null check (char_length(body) >= 10),
  slug            text not null,
  tags            text[] default '{}',
  lesson_slug     text,
  lesson_title    text,
  lesson_track    text,
  lesson_module   text,
  is_answered     boolean default false,
  answer_reply_id bigint,
  vote_count      int default 0,
  reply_count     int default 0,
  is_locked       boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists forum_threads_category_idx   on forum_threads(category_slug, created_at desc);
create index if not exists forum_threads_created_at_idx on forum_threads(created_at desc);
create index if not exists forum_threads_votes_idx      on forum_threads(vote_count desc);
create index if not exists forum_threads_fts_idx
  on forum_threads using gin(to_tsvector('english', title || ' ' || coalesce(body, '')));

alter table public.forum_threads enable row level security;
create policy "Threads are viewable by everyone."
  on forum_threads for select using (true);
create policy "Authenticated users can create threads."
  on forum_threads for insert with check (auth.uid() = author_id);
create policy "Authors can update their own threads."
  on forum_threads for update using (auth.uid() = author_id);


-- ── Forum replies ────────────────────────────────────────────
create table if not exists public.forum_replies (
  id         bigserial primary key,
  thread_id  bigint not null references public.forum_threads(id) on delete cascade,
  author_id  uuid references public.profiles(id) on delete set null,
  body       text not null check (char_length(body) >= 10),
  vote_count int default 0,
  is_answer  boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists forum_replies_thread_idx on forum_replies(thread_id, created_at);

alter table public.forum_replies enable row level security;
create policy "Replies are viewable by everyone."
  on forum_replies for select using (true);
create policy "Authenticated users can create replies."
  on forum_replies for insert with check (auth.uid() = author_id);
create policy "Authors can update their own replies."
  on forum_replies for update using (auth.uid() = author_id);


-- ── Forum votes (upvote only, one per user per target) ───────
create table if not exists public.forum_votes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  thread_id  bigint references public.forum_threads(id) on delete cascade,
  reply_id   bigint references public.forum_replies(id) on delete cascade,
  created_at timestamptz default now(),
  constraint one_target check (
    (thread_id is null) != (reply_id is null)
  )
);

create unique index if not exists forum_votes_thread_uniq
  on forum_votes(user_id, thread_id) where thread_id is not null;
create unique index if not exists forum_votes_reply_uniq
  on forum_votes(user_id, reply_id) where reply_id is not null;

alter table public.forum_votes enable row level security;
create policy "Votes are viewable by everyone."
  on forum_votes for select using (true);
create policy "Users can manage their own votes."
  on forum_votes for all using (auth.uid() = user_id);


-- ── Triggers: keep vote_count + reply_count denormalised ─────
create or replace function public.on_vote_change()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    if new.thread_id is not null then
      update public.forum_threads set vote_count = vote_count + 1 where id = new.thread_id;
    else
      update public.forum_replies set vote_count = vote_count + 1 where id = new.reply_id;
    end if;
  elsif tg_op = 'DELETE' then
    if old.thread_id is not null then
      update public.forum_threads set vote_count = greatest(0, vote_count - 1) where id = old.thread_id;
    else
      update public.forum_replies set vote_count = greatest(0, vote_count - 1) where id = old.reply_id;
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_vote_change on forum_votes;
create trigger trg_vote_change
  after insert or delete on public.forum_votes
  for each row execute procedure public.on_vote_change();

create or replace function public.on_reply_change()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_threads
    set reply_count = reply_count + 1, updated_at = now()
    where id = new.thread_id;
  elsif tg_op = 'DELETE' then
    update public.forum_threads
    set reply_count = greatest(0, reply_count - 1)
    where id = old.thread_id;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_reply_change on forum_replies;
create trigger trg_reply_change
  after insert or delete on public.forum_replies
  for each row execute procedure public.on_reply_change();
