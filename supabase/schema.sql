-- DollPlate — complete Supabase schema
-- Run this entire file once in the Supabase SQL editor to create all tables.

-- ──────────────────────────────────────────────
-- PHASE 1
-- ──────────────────────────────────────────────

create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  name text not null,
  phone text,
  dietary_flags jsonb default '{}',
  sms_enabled bool default false,
  notes text,
  created_at timestamptz default now()
);

create table if not exists never_again (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  item text not null,
  created_at timestamptz default now()
);

create table if not exists do_again (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  item text not null,
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────────
-- PHASE 2
-- ──────────────────────────────────────────────

create table if not exists weekly_plans (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  week_start date not null,
  budget numeric,
  dietary_prefs jsonb default '[]',
  cuisine_prefs jsonb default '[]',
  avoid_items text[] default '{}',
  equipment jsonb default '{}',
  cook_times jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references weekly_plans(id) on delete cascade not null,
  night date not null,
  name text not null,
  cuisine text,
  cook_time_minutes int,
  equipment text[] default '{}',
  estimated_cost numeric,
  recipe jsonb default '{}',
  nutrition jsonb default '{}',
  gluten_free_note text,
  rating int check (rating >= 1 and rating <= 5),
  notes text,
  status text default 'planned',
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────────
-- PHASE 3
-- ──────────────────────────────────────────────

create table if not exists grocery_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references weekly_plans(id) on delete cascade not null,
  meal_id uuid references meals(id) on delete set null,
  name text not null,
  category text default 'Other',
  checked bool default false,
  added_by text,
  is_community bool default false,
  estimated_cost numeric default 0,
  created_at timestamptz default now()
);

create table if not exists meal_tracking (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid references meals(id) on delete cascade not null,
  status text not null, -- 'made' | 'swapped' | 'skipped'
  swap_description text,
  rating int check (rating >= 1 and rating <= 5),
  notes text,
  tracked_at timestamptz default now()
);

-- ──────────────────────────────────────────────
-- PHASE 5
-- ──────────────────────────────────────────────

create table if not exists household_settings (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null unique,
  reminder_time text default '15:00',
  reminder_enabled bool default true,
  timezone text default 'America/New_York',
  google_access_token text,
  google_refresh_token text,
  google_token_expiry timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sms_log (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade not null,
  meal_id uuid references meals(id) on delete set null,
  sent_at timestamptz default now(),
  response text,
  responded_at timestamptz
);

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY (basic setup)
-- ──────────────────────────────────────────────
-- Enable RLS on all tables. Auth happens via Supabase Auth.
-- Adjust policies to match your auth strategy (e.g., per-household access).

alter table households enable row level security;
alter table members enable row level security;
alter table never_again enable row level security;
alter table do_again enable row level security;
alter table weekly_plans enable row level security;
alter table meals enable row level security;
alter table grocery_items enable row level security;
alter table meal_tracking enable row level security;
alter table household_settings enable row level security;
alter table sms_log enable row level security;

-- Allow authenticated users full access (tighten per household later)
create policy "auth_full_access_households" on households for all to authenticated using (true) with check (true);
create policy "auth_full_access_members" on members for all to authenticated using (true) with check (true);
create policy "auth_full_access_never_again" on never_again for all to authenticated using (true) with check (true);
create policy "auth_full_access_do_again" on do_again for all to authenticated using (true) with check (true);
create policy "auth_full_access_weekly_plans" on weekly_plans for all to authenticated using (true) with check (true);
create policy "auth_full_access_meals" on meals for all to authenticated using (true) with check (true);
create policy "auth_full_access_grocery_items" on grocery_items for all to authenticated using (true) with check (true);
create policy "auth_full_access_meal_tracking" on meal_tracking for all to authenticated using (true) with check (true);
create policy "auth_full_access_household_settings" on household_settings for all to authenticated using (true) with check (true);
create policy "auth_full_access_sms_log" on sms_log for all to authenticated using (true) with check (true);

-- Enable realtime for grocery list live updates (Phase 3)
alter publication supabase_realtime add table grocery_items;
