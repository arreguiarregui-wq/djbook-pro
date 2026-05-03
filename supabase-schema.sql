-- ================================================
-- DJBOOK PRO — Schema de base de datos (Supabase)
-- Ejecuta esto en: Supabase → SQL Editor → New query
-- ================================================

-- Extensión para UUID
create extension if not exists "uuid-ossp";

-- ------------------------------------------------
-- TABLA: profiles (perfil del DJ)
-- Se crea automáticamente cuando un usuario se registra
-- ------------------------------------------------
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  -- Info básica
  dj_name text,
  real_name text,
  bio text,
  city text,
  country text default 'ES',
  avatar_url text,

  -- Info profesional
  genres text[] default '{}',
  experience_years int default 0,
  cachet_min int default 0,
  cachet_max int default 0,
  availability text[] default '{"viernes", "sabado", "domingo"}',

  -- Rider técnico
  rider jsonb default '{"cdj": "CDJ-3000", "mixer": "DJM-900NXS2", "monitor": true}',

  -- Redes sociales
  instagram text,
  soundcloud text,
  resident_advisor text,
  website text,

  -- Plan (freemium)
  plan text default 'free' check (plan in ('free', 'pro')),
  ai_credits_used int default 0,
  ai_credits_limit int default 10
);

-- RLS: cada usuario solo ve su propio perfil
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, dj_name)
  values (new.id, new.raw_user_meta_data->>'dj_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------
-- TABLA: bookings
-- ------------------------------------------------
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  user_id uuid references public.profiles(id) on delete cascade not null,

  -- Info del evento
  venue_name text not null,
  venue_city text,
  event_date date not null,
  start_time time,
  duration_hours numeric(4,1) default 3,
  genre text,

  -- Económico
  cachet int default 0,
  currency text default 'EUR',
  travel_included boolean default true,
  accomodation_included boolean default false,

  -- Estado
  status text default 'pendiente' check (status in ('pendiente', 'confirmado', 'completado', 'cancelado')),

  -- Contacto
  promoter_name text,
  promoter_email text,
  promoter_phone text,

  -- Notas
  notes text,
  rider_notes text
);

alter table public.bookings enable row level security;
create policy "Users can CRUD own bookings" on public.bookings
  for all using (auth.uid() = user_id);

-- ------------------------------------------------
-- TABLA: venues (caché de venues investigados)
-- ------------------------------------------------
create table public.venues (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now(),

  user_id uuid references public.profiles(id) on delete cascade not null,

  name text not null,
  city text,
  country text,
  genre text,

  -- Datos del research IA
  research_data jsonb,
  score int,

  -- Relación con bookings
  bookings_count int default 0
);

alter table public.venues enable row level security;
create policy "Users can CRUD own venues" on public.venues
  for all using (auth.uid() = user_id);

-- ------------------------------------------------
-- TABLA: ai_generations (historial de generaciones IA)
-- Para controlar el plan freemium
-- ------------------------------------------------
create table public.ai_generations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now(),

  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'bio', 'post', 'email', 'negotiation', 'research'
  input_data jsonb,
  result text,
  tokens_used int default 0
);

alter table public.ai_generations enable row level security;
create policy "Users can view own generations" on public.ai_generations
  for select using (auth.uid() = user_id);
create policy "Users can insert own generations" on public.ai_generations
  for insert with check (auth.uid() = user_id);

-- ------------------------------------------------
-- VISTA: dashboard_stats
-- Estadísticas rápidas para el dashboard
-- ------------------------------------------------
create or replace view public.dashboard_stats as
select
  user_id,
  count(*) filter (where date_trunc('month', event_date) = date_trunc('month', current_date)) as bookings_this_month,
  count(*) filter (where status = 'confirmado') as confirmed_total,
  count(*) filter (where status = 'pendiente') as pending_total,
  coalesce(sum(cachet) filter (
    where status in ('confirmado', 'completado')
    and date_trunc('month', event_date) = date_trunc('month', current_date)
  ), 0) as revenue_this_month,
  coalesce(avg(cachet) filter (where status in ('confirmado', 'completado')), 0) as avg_cachet
from public.bookings
group by user_id;
