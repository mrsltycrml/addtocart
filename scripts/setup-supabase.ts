import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Starting Supabase setup...');

  try {
    // Create profiles table
    console.log('📦 Creating profiles table...');
    const { error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (tableError && !tableError.message.includes('does not exist')) {
      throw tableError;
    }

    // Enable RLS
    console.log('🔒 Setting up Row Level Security...');
    const { error: rlsError } = await supabase.rpc('enable_rls', {
      table_name: 'profiles'
    });

    if (rlsError && !rlsError.message.includes('already enabled')) {
      throw rlsError;
    }

    // Create storage bucket for avatars
    console.log('📁 Setting up storage for avatars...');
    const { error: storageError } = await supabase.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
      fileSizeLimit: 5242880, // 5MB
    });

    if (storageError && !storageError.message.includes('already exists')) {
      throw storageError;
    }

    console.log('\n✅ Basic setup completed!');
    console.log('\n⚠️  IMPORTANT: Please follow these manual steps in your Supabase dashboard:');
    console.log('\n1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Create a new query and paste this SQL:');
    console.log(`
-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Create trigger for new user profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
    `);
    console.log('\n4. Run the SQL query');
    console.log('\n5. Go to Authentication > Providers');
    console.log('6. Enable Email provider');
    console.log('7. Configure your site URL and redirect URLs');
    console.log('\nAfter completing these steps, your signup functionality should work correctly!');

  } catch (error: any) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

setupDatabase(); 