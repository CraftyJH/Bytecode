-- ============================================================
-- Bytecode Site Settings — Migration 003
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null default 'null'::jsonb,
  updated_at timestamptz not null default now()
);

-- Only service-role (admin) can read/write; no public access.
alter table public.site_settings enable row level security;

-- Seed the download-disabled flag as false.
insert into public.site_settings (key, value)
values ('android_download_disabled', 'false'::jsonb)
on conflict (key) do nothing;
