-- Ochit one-page portfolio: read-only public schema
-- Applied to project wpjzzywwbfsyltliulqg on 2026-10-06 via Supabase MCP.
-- Initial rows were seeded from js/data.js (2 projects, 19 team members, 7 categories).

create table public.site_settings (
  key   text primary key,
  value text not null default ''
);

create table public.categories (
  key        text primary key,
  label      text not null,
  icon       text,
  color      text,
  sort_order int not null default 0
);

create table public.projects (
  slug            text primary key,
  title           text not null,
  title_en        text,
  tagline         text,
  category        text not null references public.categories(key),
  start_date      date not null,
  end_date        date,
  location        text,
  province        text,
  region          text check (region in ('north','northeast','central','south')),
  org             text,
  partners        text[] not null default '{}',
  summary         text,
  problem         text,
  did             text,
  hours           int not null default 0,
  beneficiaries   int not null default 0,
  highlight_value text,
  highlight_label text,
  cover           text,
  before_img      text,
  after_img       text,
  reflection      text,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now()
);

create table public.project_activities (
  id           bigint generated always as identity primary key,
  project_slug text not null references public.projects(slug) on delete cascade on update cascade,
  no           text,
  th           text not null,
  en           text,
  brand        text,
  img          text,
  icon         text,
  sort_order   int not null default 0
);
create index on public.project_activities (project_slug);

create table public.project_images (
  id           bigint generated always as identity primary key,
  project_slug text not null references public.projects(slug) on delete cascade on update cascade,
  path         text not null,
  alt_text     text,
  sort_order   int not null default 0
);
create index on public.project_images (project_slug);

create table public.team_members (
  slug         text primary key,
  name         text not null,
  tier         text not null check (tier in ('cofounder','member')),
  role         text,
  duties       text[] not null default '{}',
  photo        text,
  quote        text,
  is_leader    boolean not null default false,
  sort_order   int not null default 0,
  is_published boolean not null default true
);

create table public.project_members (
  project_slug text not null references public.projects(slug) on delete cascade on update cascade,
  member_slug  text not null references public.team_members(slug) on delete cascade on update cascade,
  role         text,
  hours        int,
  primary key (project_slug, member_slug)
);
create index on public.project_members (member_slug);

create table public.recognitions (
  id           bigint generated always as identity primary key,
  title        text not null,
  issuer       text,
  date         date,
  type         text check (type in ('letter','certificate','news','award')),
  project_slug text references public.projects(slug) on delete set null on update cascade,
  url          text,
  sort_order   int not null default 0
);
create index on public.recognitions (project_slug);

-- RLS: public read-only
alter table public.site_settings      enable row level security;
alter table public.categories         enable row level security;
alter table public.projects           enable row level security;
alter table public.project_activities enable row level security;
alter table public.project_images     enable row level security;
alter table public.team_members       enable row level security;
alter table public.project_members    enable row level security;
alter table public.recognitions       enable row level security;

create policy "public read" on public.site_settings for select to anon, authenticated using (true);
create policy "public read" on public.categories    for select to anon, authenticated using (true);
create policy "public read" on public.projects      for select to anon, authenticated using (is_published);
create policy "public read" on public.team_members  for select to anon, authenticated using (is_published);
create policy "public read" on public.project_activities for select to anon, authenticated using (
  exists (select 1 from public.projects p where p.slug = project_slug and p.is_published));
create policy "public read" on public.project_images for select to anon, authenticated using (
  exists (select 1 from public.projects p where p.slug = project_slug and p.is_published));
create policy "public read" on public.project_members for select to anon, authenticated using (
  exists (select 1 from public.projects p where p.slug = project_slug and p.is_published)
  and exists (select 1 from public.team_members m where m.slug = member_slug and m.is_published));
create policy "public read" on public.recognitions for select to anon, authenticated using (
  project_slug is null or exists (select 1 from public.projects p where p.slug = project_slug and p.is_published));

grant select on public.site_settings, public.categories, public.projects, public.project_activities,
  public.project_images, public.team_members, public.project_members, public.recognitions
  to anon, authenticated;
