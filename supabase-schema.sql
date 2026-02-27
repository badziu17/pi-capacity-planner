-- ═══════════════════════════════════════════════════════════════
-- VENTURA v6 — Supabase PostgreSQL Schema
-- Complete database with Row Level Security
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ══ PROFILES ══
-- Extended user profiles (linked to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text,
  avatar_url text,
  color text default '#C4704B',
  locale text default 'en' check (locale in ('pl', 'en')),
  home_currency text default 'PLN',
  social jsonb default '{}',
  friends uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ══ TRIPS ══
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  destination text,
  start_date date,
  end_date date,
  currency text default 'PLN',
  status text default 'planning' check (status in ('planning', 'upcoming', 'active', 'past')),
  budget_total numeric default 0,
  hero_img text,
  completeness int default 5,
  share_token text unique default encode(gen_random_bytes(16), 'hex'),
  is_public boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ══ TRIP MEMBERS ══
create table public.trip_members (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'companion' check (role in ('admin', 'companion', 'observer')),
  vacation_status text default 'not_applied' check (vacation_status in ('not_applied', 'applied', 'approved', 'denied')),
  joined_at timestamptz default now(),
  unique(trip_id, user_id)
);

-- ══ ITINERARY DAYS ══
create table public.itinerary_days (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_number int not null,
  title text,
  date date,
  weather jsonb,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ══ ACTIVITIES ══
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  day_id uuid references public.itinerary_days(id) on delete cascade not null,
  trip_id uuid references public.trips(id) on delete cascade not null,
  name text not null,
  description text,
  type text default 'sight' check (type in ('sight', 'food', 'museum', 'shopping', 'transport', 'activity')),
  time time,
  duration interval default '1 hour',
  cost numeric default 0,
  latitude double precision,
  longitude double precision,
  place_id text, -- Google/OSM place reference
  address text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  proposed_by uuid references public.profiles(id),
  ticket_url text,
  ticket_bought boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ══ VOTES ══
create table public.votes (
  id uuid default uuid_generate_v4() primary key,
  activity_id uuid references public.activities(id) on delete cascade,
  comparison_id uuid references public.comparisons(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  value int default 1 check (value in (-1, 0, 1)),
  created_at timestamptz default now(),
  unique(activity_id, user_id),
  check (activity_id is not null or comparison_id is not null)
);

-- ══ FAVORITES ══
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(activity_id, user_id)
);

-- ══ EXPENSES ══
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  name text not null,
  category text default 'Other' check (category in ('Accommodation', 'Food', 'Activities', 'Shopping', 'Transport', 'Other')),
  amount numeric not null,
  currency text default 'PLN',
  paid_by uuid references public.profiles(id) not null,
  split_among uuid[] default '{}', -- empty = split among all trip members
  date date default current_date,
  receipt_url text,
  notes text,
  created_at timestamptz default now()
);

-- ══ SETTLEMENTS ══
-- Tracks who owes whom after expense splitting
create table public.settlements (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  from_user uuid references public.profiles(id) not null,
  to_user uuid references public.profiles(id) not null,
  amount numeric not null,
  currency text default 'PLN',
  settled boolean default false,
  settled_at timestamptz,
  created_at timestamptz default now()
);

-- ══ PACKING ITEMS ══
create table public.packing_items (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  category text not null,
  item text not null,
  quantity int default 1,
  packed boolean default false,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- ══ JOURNAL ENTRIES ══
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  entry_type text default 'text' check (entry_type in ('text', 'photo', 'milestone')),
  photos text[] default '{}',
  created_at timestamptz default now()
);

-- ══ COMPARISONS (stay/hotel comparisons) ══
create table public.comparisons (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  name text not null,
  url text,
  source text, -- 'Booking.com', 'Airbnb', etc.
  price text,
  rating numeric,
  notes text,
  pros text[] default '{}',
  cons text[] default '{}',
  proposed_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- ══ STEP COUNTER DATA ══
create table public.step_data (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_id uuid references public.itinerary_days(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  steps int not null,
  synced_at timestamptz default now(),
  unique(day_id, user_id)
);

-- ══ PLANNING TIPS ══
create table public.planning_tips (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  icon text,
  title_pl text,
  title_en text,
  desc_pl text,
  desc_en text,
  done boolean default false,
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  sort_order int default 0
);

-- ══ INDEXES ══
create index idx_trip_members_trip on public.trip_members(trip_id);
create index idx_trip_members_user on public.trip_members(user_id);
create index idx_activities_day on public.activities(day_id);
create index idx_activities_trip on public.activities(trip_id);
create index idx_expenses_trip on public.expenses(trip_id);
create index idx_journal_trip on public.journal_entries(trip_id);
create index idx_packing_trip on public.packing_items(trip_id);
create index idx_itinerary_trip on public.itinerary_days(trip_id);
create index idx_trips_share on public.trips(share_token);
create index idx_activities_location on public.activities(latitude, longitude) where latitude is not null;

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.activities enable row level security;
alter table public.votes enable row level security;
alter table public.favorites enable row level security;
alter table public.expenses enable row level security;
alter table public.settlements enable row level security;
alter table public.packing_items enable row level security;
alter table public.journal_entries enable row level security;
alter table public.comparisons enable row level security;
alter table public.step_data enable row level security;
alter table public.planning_tips enable row level security;

-- Helper function: check if user is a member of a trip
create or replace function public.is_trip_member(p_trip_id uuid, p_user_id uuid)
returns boolean as $$
  select exists(
    select 1 from public.trip_members 
    where trip_id = p_trip_id and user_id = p_user_id
  );
$$ language sql security definer stable;

-- Helper: check if user can edit (admin or companion)
create or replace function public.can_edit_trip(p_trip_id uuid, p_user_id uuid)
returns boolean as $$
  select exists(
    select 1 from public.trip_members 
    where trip_id = p_trip_id 
    and user_id = p_user_id 
    and role in ('admin', 'companion')
  );
$$ language sql security definer stable;

-- PROFILES: users see all profiles (for trip member display), edit own
create policy "Profiles viewable by authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- TRIPS: members see their trips, public trips visible to all
create policy "Trip members can view trips" on public.trips
  for select using (
    is_public = true 
    or is_trip_member(id, auth.uid())
  );
create policy "Authenticated users can create trips" on public.trips
  for insert with check (auth.uid() = created_by);
create policy "Trip editors can update" on public.trips
  for update using (can_edit_trip(id, auth.uid()));
create policy "Trip admin can delete" on public.trips
  for delete using (created_by = auth.uid());

-- TRIP MEMBERS: visible to trip members, editable by admin
create policy "Members see co-members" on public.trip_members
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Admin can add members" on public.trip_members
  for insert with check (can_edit_trip(trip_id, auth.uid()));
create policy "Members can update own status" on public.trip_members
  for update using (user_id = auth.uid() or can_edit_trip(trip_id, auth.uid()));
create policy "Admin can remove members" on public.trip_members
  for delete using (can_edit_trip(trip_id, auth.uid()) or user_id = auth.uid());

-- ITINERARY DAYS: visible to members, editable by editors
create policy "Members see days" on public.itinerary_days
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Editors manage days" on public.itinerary_days
  for all using (can_edit_trip(trip_id, auth.uid()));

-- ACTIVITIES: visible to members, proposable by editors
create policy "Members see activities" on public.activities
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Editors manage activities" on public.activities
  for all using (can_edit_trip(trip_id, auth.uid()));

-- VOTES: members can vote
create policy "Members see votes" on public.votes
  for select using (true); -- votes are semi-public within trip context
create policy "Members can vote" on public.votes
  for insert with check (auth.uid() = user_id);
create policy "Users manage own votes" on public.votes
  for update using (auth.uid() = user_id);
create policy "Users delete own votes" on public.votes
  for delete using (auth.uid() = user_id);

-- FAVORITES: personal
create policy "Users see own favorites" on public.favorites
  for select using (auth.uid() = user_id);
create policy "Users manage favorites" on public.favorites
  for all using (auth.uid() = user_id);

-- EXPENSES: trip members see, editors manage
create policy "Members see expenses" on public.expenses
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Editors manage expenses" on public.expenses
  for all using (can_edit_trip(trip_id, auth.uid()));

-- SETTLEMENTS: trip members
create policy "Members see settlements" on public.settlements
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Members manage settlements" on public.settlements
  for all using (is_trip_member(trip_id, auth.uid()));

-- PACKING: trip members
create policy "Members see packing" on public.packing_items
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Editors manage packing" on public.packing_items
  for all using (can_edit_trip(trip_id, auth.uid()));

-- JOURNAL: trip members read, editors write
create policy "Members read journal" on public.journal_entries
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Members write journal" on public.journal_entries
  for insert with check (is_trip_member(trip_id, auth.uid()) and auth.uid() = author_id);
create policy "Authors edit own entries" on public.journal_entries
  for update using (auth.uid() = author_id);

-- COMPARISONS: trip members
create policy "Members see comparisons" on public.comparisons
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Editors manage comparisons" on public.comparisons
  for all using (can_edit_trip(trip_id, auth.uid()));

-- STEP DATA: trip members
create policy "Members see steps" on public.step_data
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Users manage own steps" on public.step_data
  for all using (auth.uid() = user_id);

-- PLANNING TIPS: trip members
create policy "Members see tips" on public.planning_tips
  for select using (is_trip_member(trip_id, auth.uid()));
create policy "Editors manage tips" on public.planning_tips
  for all using (can_edit_trip(trip_id, auth.uid()));

-- ═══════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════

-- Auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-add creator as admin when trip is created
create or replace function public.handle_new_trip()
returns trigger as $$
begin
  insert into public.trip_members (trip_id, user_id, role)
  values (new.id, new.created_by, 'admin');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_trip_created
  after insert on public.trips
  for each row execute procedure public.handle_new_trip();

-- Auto-approve activity if majority votes yes
create or replace function public.check_activity_approval()
returns trigger as $$
declare
  member_count int;
  vote_count int;
  v_trip_id uuid;
begin
  select a.trip_id into v_trip_id from public.activities a where a.id = new.activity_id;
  select count(*) into member_count from public.trip_members where trip_id = v_trip_id and role in ('admin', 'companion');
  select count(*) into vote_count from public.votes where activity_id = new.activity_id and value = 1;
  
  if vote_count >= ceil(member_count::numeric / 2) then
    update public.activities set status = 'approved' where id = new.activity_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_vote_check_approval
  after insert or update on public.votes
  for each row when (new.activity_id is not null)
  execute procedure public.check_activity_approval();

-- Calculate expense settlements for a trip
create or replace function public.calculate_settlements(p_trip_id uuid)
returns table(from_user uuid, to_user uuid, amount numeric) as $$
declare
  r record;
begin
  -- Delete existing unsettled settlements
  delete from public.settlements where trip_id = p_trip_id and settled = false;
  
  -- Calculate net balances
  return query
  with members as (
    select user_id from public.trip_members where trip_id = p_trip_id and role in ('admin', 'companion')
  ),
  expense_splits as (
    select 
      e.paid_by,
      m.user_id as owes_to,
      e.amount / (
        case when array_length(e.split_among, 1) > 0 
        then array_length(e.split_among, 1) 
        else (select count(*) from members) 
        end
      ) as share
    from public.expenses e
    cross join members m
    where e.trip_id = p_trip_id
    and (array_length(e.split_among, 1) is null or array_length(e.split_among, 1) = 0 or m.user_id = any(e.split_among))
    and m.user_id != e.paid_by
  ),
  balances as (
    select owes_to as from_user, paid_by as to_user, sum(share) as amount
    from expense_splits
    group by owes_to, paid_by
    having sum(share) > 0.01
  )
  select b.from_user, b.to_user, round(b.amount, 2) as amount
  from balances b;
end;
$$ language plpgsql security definer;

-- Updated_at trigger
create or replace function public.update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.update_timestamp();
create trigger set_updated_at before update on public.trips
  for each row execute procedure public.update_timestamp();

-- ═══════════════════════════════════════
-- REALTIME SUBSCRIPTIONS
-- ═══════════════════════════════════════

-- Enable realtime for collaborative features
alter publication supabase_realtime add table public.activities;
alter publication supabase_realtime add table public.votes;
alter publication supabase_realtime add table public.expenses;
alter publication supabase_realtime add table public.journal_entries;
alter publication supabase_realtime add table public.packing_items;
alter publication supabase_realtime add table public.trip_members;
alter publication supabase_realtime add table public.comparisons;

-- ═══════════════════════════════════════
-- DONE! Your Ventura database is ready.
-- Next: Enable Google OAuth in Authentication → Providers
-- ═══════════════════════════════════════
