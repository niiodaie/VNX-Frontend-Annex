-- Supabase Database Setup for Nexus Tracker Admin System
-- Run these commands in your Supabase SQL Editor

-- Drop existing profiles table if it has foreign key issues
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table for user management (standalone, no foreign keys)
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    display_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table for project management
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on_hold')),
    owner_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table for user-project assignments
CREATE TABLE IF NOT EXISTS project_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Insert sample data for testing
INSERT INTO profiles (id, display_name, role) VALUES
    (gen_random_uuid(), 'John Doe', 'super_admin'),
    (gen_random_uuid(), 'Jane Smith', 'admin'),
    (gen_random_uuid(), 'Bob Wilson', 'moderator'),
    (gen_random_uuid(), 'Alice Cooper', 'user'),
    (gen_random_uuid(), 'Mike Johnson', 'user')
ON CONFLICT DO NOTHING;

INSERT INTO projects (name, description, status) VALUES
    ('Website Redesign', 'Complete redesign of company website', 'active'),
    ('Mobile App Development', 'iOS and Android app development', 'planning'),
    ('Marketing Campaign', 'Q1 2025 marketing strategy', 'completed'),
    ('Database Migration', 'Migrate to new database system', 'active')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access (adjust as needed)
CREATE POLICY "Allow all operations for authenticated users" ON profiles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON project_members
    FOR ALL USING (auth.role() = 'authenticated');