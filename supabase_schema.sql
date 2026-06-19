-- AI Influencer Studio Database Schema

-- 1. Create profiles table (holds user credit balance)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  credits integer not null default 10,
  full_name text,
  username text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Row Level Security (RLS) Policies for profiles
create policy "Allow users to view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

-- 2. Create trigger to automatically create a profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, credits, full_name, username)
  values (
    new.id,
    new.email,
    10,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create characters table
create table if not exists public.characters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  age integer not null,
  skin_tone text not null,
  body_type text not null,
  hair_color_style text not null,
  eye_color text not null,
  style_vibe text not null,
  reference_image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for characters
alter table public.characters enable row level security;

-- Policies for characters
create policy "Allow users to manage their own characters"
  on public.characters for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Create generations table
create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  character_id uuid references public.characters on delete cascade not null,
  prompt text not null,
  input_image_url text not null,
  output_image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for generations
alter table public.generations enable row level security;

-- Policies for generations
create policy "Allow users to manage their own generations"
  on public.generations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage bucket configurations:
-- Note: Make sure to create a public storage bucket named "influencer-studio" in your Supabase Dashboard under Storage.
-- Then execute the following policies to enable access:
--
-- Policy for inserting files:
-- create policy "Allow authenticated users to upload files"
--   on storage.objects for insert
--   to authenticated
--   with check (bucket_id = 'influencer-studio');
--
-- Policy for reading files:
-- create policy "Allow public to read files"
--   on storage.objects for select
--   to public
--   using (bucket_id = 'influencer-studio');
