-- Row Level Security Policies for Nexus Tracker Admin System
-- Run these commands in your Supabase SQL Editor after the basic table setup

-- Step 1: Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Step 2: Profiles Table Policies
-- Allow users to read and update their own profile
CREATE POLICY "User can read their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "User can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Allow super admins to manage all profiles
CREATE POLICY "Super admins can manage all profiles"
  ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Step 3: Projects Table Policies
-- Allow project owners to manage their own projects
CREATE POLICY "Owner can manage their own projects"
  ON projects
  FOR ALL
  USING (auth.uid() = owner_id);

-- Allow users to create projects (owner_id must match auth.uid())
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Allow admins to view all projects
CREATE POLICY "Admins can view all projects"
  ON projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'moderator')
    )
  );

-- Allow super admins to manage all projects
CREATE POLICY "Super admins can manage all projects"
  ON projects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );