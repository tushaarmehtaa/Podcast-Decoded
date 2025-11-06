-- Enable required extension for UUID generation
create extension if not exists "pgcrypto";

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  podcast_name text not null,
  podcast_host text,
  podcast_category text[],
  podcast_artwork_url text,
  episode_title text not null,
  episode_number integer,
  episode_date timestamp,
  episode_duration_minutes integer,
  guest_name text,
  guest_title text,
  guest_bio text,
  guest_avatar_url text,
  summary text,
  key_takeaways jsonb,
  full_notes text,
  resources_mentioned jsonb,
  tags text[],
  read_time_minutes integer,
  view_count integer default 0,
  created_at timestamp default now(),
  published_at timestamp
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  podcast_name text not null,
  episode_url text,
  requester_email text,
  status text default 'pending',
  vote_count integer default 1,
  created_at timestamp default now()
);

create index if not exists idx_episodes_category on public.episodes using gin (podcast_category);
create index if not exists idx_episodes_published on public.episodes (published_at desc);
