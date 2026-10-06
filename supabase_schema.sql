-- ROCK ESPORTS online CMS
-- Run this in Supabase SQL Editor AFTER creating a project.
create extension if not exists pgcrypto;

create table if not exists site_settings (
  id bigint primary key default 1 check (id=1),
  hero_title text not null default 'ROCK ESPORTS',
  hero_text text default '',
  about_title text default 'About ROCK ESPORTS',
  about_text text default '',
  email text default 'rockesprots.offical@gmail.com',
  social text default 'YouTube · Facebook · TikTok · Instagram · Discord',
  updated_at timestamptz default now()
);
insert into site_settings(id) values(1) on conflict(id) do nothing;

create table if not exists management (
 id uuid primary key default gen_random_uuid(),
 slot int unique not null check(slot between 1 and 8),
 name text not null default '',
 position text default '',
 bio text default '',
 photo_url text default '',
 updated_at timestamptz default now()
);
create table if not exists members (
 id uuid primary key default gen_random_uuid(),
 slot int unique not null check(slot between 1 and 16),
 name text not null default '',
 role text default '',
 bio text default '',
 photo_url text default '',
 updated_at timestamptz default now()
);
create table if not exists news (
 id uuid primary key default gen_random_uuid(),
 title text not null default '',
 body text default '',
 image_url text default '',
 published boolean default false,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);
create table if not exists tournaments (
 id uuid primary key default gen_random_uuid(),
 title text not null default '',
 status text default 'UPCOMING',
 body text default '',
 image_url text default '',
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);

insert into management(slot,name,position) values
(1,'Management 01','Founder & Owner'),(2,'Management 02','General Manager'),
(3,'Management 03','Tournament Manager'),(4,'Management 04','Finance Manager'),
(5,'Management 05','Operations Manager'),(6,'Management 06','Media & Public Relations'),
(7,'Management 07','Secretary'),(8,'Management 08','Member Representative')
on conflict(slot) do nothing;

insert into members(slot,name,role)
select g, 'Member '||lpad(g::text,2,'0'), 'Official Member' from generate_series(1,16) g
on conflict(slot) do nothing;

insert into news(title,body,published) values('Welcome to ROCK ESPORTS','Official organization updates will appear here.',true);
insert into tournaments(title,status,body) values('ROCK ESPORTS Tournament','UPCOMING','Tournament details, registration and schedules will appear here.');

alter table site_settings enable row level security;
alter table management enable row level security;
alter table members enable row level security;
alter table news enable row level security;
alter table tournaments enable row level security;

-- Public can read website content.
create policy "public read settings" on site_settings for select using (true);
create policy "public read management" on management for select using (true);
create policy "public read members" on members for select using (true);
create policy "public read published news" on news for select using (published=true);
create policy "public read tournaments" on tournaments for select using (true);

-- Only authenticated users can write. IMPORTANT: create ONLY your owner account in Supabase Auth.
create policy "owner update settings" on site_settings for update to authenticated using (true) with check (true);
create policy "owner write management" on management for all to authenticated using (true) with check (true);
create policy "owner write members" on members for all to authenticated using (true) with check (true);
create policy "owner write news" on news for all to authenticated using (true) with check (true);
create policy "owner write tournaments" on tournaments for all to authenticated using (true) with check (true);

-- Storage bucket for website photos.
insert into storage.buckets (id,name,public) values ('site-media','site-media',true)
on conflict(id) do update set public=true;
create policy "public read site media" on storage.objects for select using (bucket_id='site-media');
create policy "authenticated upload site media" on storage.objects for insert to authenticated with check(bucket_id='site-media');
create policy "authenticated update site media" on storage.objects for update to authenticated using(bucket_id='site-media') with check(bucket_id='site-media');
create policy "authenticated delete site media" on storage.objects for delete to authenticated using(bucket_id='site-media');
