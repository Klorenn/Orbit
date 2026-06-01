-- supabase/blog-cache-schema.sql
create table if not exists blog_cache (
  id          int primary key default 1,
  articles    jsonb not null default '[]',
  fetched_at  timestamptz not null default now(),
  constraint  single_row check (id = 1)
);

alter table blog_cache enable row level security;

create policy "public read blog_cache"
  on blog_cache for select
  using (true);
