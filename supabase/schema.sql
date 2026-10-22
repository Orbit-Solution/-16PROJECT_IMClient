-- Divigamana schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create type public.user_status as enum ('ACTIVE','NUMBER_ONLY','BLOCKED');
create type public.subscription_status as enum ('INACTIVE','PENDING','ACTIVE','FAILED','CANCELLED','EXPIRED');
create type public.provider_mode as enum ('MOCK','LIVE');

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(), auth_user_id uuid unique references auth.users(id) on delete set null,
  phone text not null unique, operator text, status public.user_status not null default 'NUMBER_ONLY',
  subscription_status public.subscription_status not null default 'INACTIVE', verified_at timestamptz,
  created_at timestamptz not null default now(), last_login timestamptz, remember_hash text, updated_at timestamptz not null default now()
);
create index if not exists users_status_idx on public.users(status);
create index if not exists users_created_idx on public.users(created_at);
create index if not exists users_last_login_idx on public.users(last_login);

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(), auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','super_admin','analyst')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  session_identifier_hash text not null unique, created_at timestamptz not null default now(), expires_at timestamptz not null, revoked_at timestamptz, last_seen_at timestamptz
);
create index if not exists user_sessions_active_idx on public.user_sessions(user_id, expires_at) where revoked_at is null;
create table if not exists public.otp_requests (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.users(id) on delete cascade, phone text not null,
  otp_hash text not null, provider text not null default 'mock', verification_attempts integer not null default 0 check (verification_attempts >= 0),
  expires_at timestamptz not null, verified_at timestamptz, created_at timestamptz not null default now()
);
create index if not exists otp_requests_phone_idx on public.otp_requests(phone, created_at desc);

create table if not exists public.astrology_services (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title_si text not null, title_en text not null,
  description text, icon text, form_schema jsonb not null default '{}'::jsonb, result_schema jsonb not null default '{}'::jsonb,
  requires_subscription boolean not null default false, is_active boolean not null default true, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  provider_subscription_id text, service_id uuid references public.astrology_services(id) on delete set null, operator text,
  status public.subscription_status not null default 'INACTIVE', provider_mode public.provider_mode not null default 'MOCK',
  started_at timestamptz, expires_at timestamptz, updated_at timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id, status);

create table if not exists public.astrology_requests (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  service_id uuid not null references public.astrology_services(id) on delete restrict, input_data jsonb not null,
  request_status text not null default 'PENDING' check (request_status in ('PENDING','PROCESSING','COMPLETED','FAILED')),
  created_at timestamptz not null default now(), completed_at timestamptz
);
create table if not exists public.astrology_results (
  id uuid primary key default gen_random_uuid(), request_id uuid not null unique references public.astrology_requests(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade, result_json jsonb not null, ai_model text, generated_at timestamptz not null default now()
);
create index if not exists astrology_results_user_idx on public.astrology_results(user_id, generated_at desc);

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.users(id) on delete set null, service_id uuid references public.astrology_services(id) on delete set null,
  model text, input_tokens integer not null default 0, output_tokens integer not null default 0, estimated_cost numeric(12,6) not null default 0,
  latency_ms integer, status text not null check (status in ('SUCCESS','ERROR')), error_code text, created_at timestamptz not null default now()
);
create index if not exists ai_usage_created_idx on public.ai_usage_logs(created_at);
create table if not exists public.rahu_calendar (
  id uuid primary key default gen_random_uuid(), calendar_date date not null, location_name text not null, latitude numeric(9,6) not null, longitude numeric(9,6) not null,
  sunrise_at timestamptz not null, sunset_at timestamptz not null, rahu_start_at timestamptz not null, rahu_end_at timestamptz not null,
  calculation_source text not null, updated_at timestamptz not null default now(), unique(calendar_date, location_name)
);
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(), admin_id uuid not null references public.admin_profiles(id) on delete restrict,
  action text not null, target_type text, target_id text, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index if not exists audit_created_idx on public.admin_audit_logs(created_at desc);
create table if not exists public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(), provider text not null, provider_event_id text not null, payload jsonb not null,
  processing_status text not null default 'RECEIVED' check (processing_status in ('RECEIVED','PROCESSED','FAILED')),
  received_at timestamptz not null default now(), processed_at timestamptz, unique(provider, provider_event_id)
);
create table if not exists public.user_login_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  logged_in_at timestamptz not null default now(), login_result text not null check (login_result in ('SUCCESS','FAILURE')), operator text
);
create index if not exists login_events_date_idx on public.user_login_events(logged_in_at);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at before update on public.users for each row execute function public.touch_updated_at();
drop trigger if exists admin_profiles_touch_updated_at on public.admin_profiles;
create trigger admin_profiles_touch_updated_at before update on public.admin_profiles for each row execute function public.touch_updated_at();
drop trigger if exists services_touch_updated_at on public.astrology_services;
create trigger services_touch_updated_at before update on public.astrology_services for each row execute function public.touch_updated_at();

alter table public.users enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.user_sessions enable row level security;
alter table public.otp_requests enable row level security;
alter table public.subscriptions enable row level security;
alter table public.astrology_services enable row level security;
alter table public.astrology_requests enable row level security;
alter table public.astrology_results enable row level security;
alter table public.ai_usage_logs enable row level security;
alter table public.rahu_calendar enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.site_settings enable row level security;
alter table public.webhook_events enable row level security;
alter table public.user_login_events enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.admin_profiles where auth_user_id = auth.uid()); $$;
create policy "active services are public" on public.astrology_services for select using (is_active = true or public.is_admin());
create policy "users read own profile" on public.users for select using (auth_user_id = auth.uid() or public.is_admin());
create policy "users read own subscriptions" on public.subscriptions for select using (exists(select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()) or public.is_admin());
create policy "users read own requests" on public.astrology_requests for select using (exists(select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()) or public.is_admin());
create policy "users read own results" on public.astrology_results for select using (exists(select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()) or public.is_admin());
create policy "public reads rahu calendar" on public.rahu_calendar for select using (true);
create policy "admins read audit" on public.admin_audit_logs for select using (public.is_admin());
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read usage" on public.ai_usage_logs for select using (public.is_admin());
create policy "admins read login events" on public.user_login_events for select using (public.is_admin());

create or replace function public.admin_block_user(target uuid, reason text) returns void language plpgsql security definer set search_path = public as $$
declare admin_profile uuid; begin select id into admin_profile from public.admin_profiles where auth_user_id = auth.uid(); if admin_profile is null then raise exception 'not authorized'; end if;
  update public.users set status='BLOCKED', remember_hash=null, updated_at=now() where id=target;
  insert into public.admin_audit_logs(admin_id, action, target_type, target_id, details) values(admin_profile,'USER_BLOCK','USER',target::text,jsonb_build_object('reason',reason));
end; $$;
create or replace function public.admin_unblock_user(target uuid) returns void language plpgsql security definer set search_path = public as $$
declare admin_profile uuid; restored public.user_status; begin select id into admin_profile from public.admin_profiles where auth_user_id=auth.uid(); if admin_profile is null then raise exception 'not authorized'; end if;
  select case when verified_at is null then 'NUMBER_ONLY'::public.user_status else 'ACTIVE'::public.user_status end into restored from public.users where id=target;
  update public.users set status=restored, updated_at=now() where id=target;
  insert into public.admin_audit_logs(admin_id, action, target_type, target_id) values(admin_profile,'USER_UNBLOCK','USER',target::text);
end; $$;
