-- Complete Admin System Setup for Nexus Tracker
-- Run this script in your Supabase SQL Editor

-- First, add owner_id column to projects if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_id UUID;

-- Update existing projects to have a default owner (first super_admin)
UPDATE projects 
SET owner_id = (
  SELECT id FROM profiles 
  WHERE role = 'super_admin' 
  LIMIT 1
) 
WHERE owner_id IS NULL;

-- Create invites table for role-based user registration
CREATE TABLE IF NOT EXISTS invites (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator', 'super_admin')),
  invited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enhanced trigger function that checks invites table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles with role from invite table, fallback to 'user'
  INSERT INTO public.profiles (id, display_name, role)
  SELECT NEW.id, NEW.email, COALESCE(i.role, 'user')
  FROM (SELECT * FROM invites WHERE email = NEW.email LIMIT 1) i
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for new user registration with invite role inheritance
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "User can read their own profile" ON profiles;
DROP POLICY IF EXISTS "User can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Owner can manage their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Super admins can manage all projects" ON projects;

-- Profiles policies
CREATE POLICY "User can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "User can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'moderator')
    )
  );

CREATE POLICY "Super admins can manage all profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Projects policies
CREATE POLICY "Owner can manage their own projects"
  ON projects FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'moderator')
    )
  );

CREATE POLICY "Super admins can manage all projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );