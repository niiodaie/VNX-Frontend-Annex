-- Test Edge Function for Supabase Insert Operation
-- This tests the exact scenario you're facing

-- First, let's check if the profiles table structure matches your test
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check current RLS policies on profiles table
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Test insert operation (this should work after RLS fix)
-- Note: Replace 'some-uuid' with actual UUID format
INSERT INTO profiles (id, display_name, role) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'Visnec Media',
  'user'
) 
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role;

-- Verify the insert worked
SELECT id, display_name, role, created_at 
FROM profiles 
WHERE display_name = 'Visnec Media';

-- Test the invites table as well
INSERT INTO invites (email, role) 
VALUES ('visnecm@gmail.com', 'super_admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- Check invites table
SELECT * FROM invites WHERE email = 'visnecm@gmail.com';