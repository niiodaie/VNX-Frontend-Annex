# Database Setup Instructions - Fix RLS Issues

## Current Issue
Supabase RLS (Row Level Security) is blocking insert operations because the policies don't allow users to create profiles or invites.

## Quick Fix - Run This SQL in Your Supabase SQL Editor

```sql
-- Step 1: Add missing INSERT policy for profiles table
DROP POLICY IF EXISTS "Users can insert their own profile during signup" ON profiles;
CREATE POLICY "Users can insert their own profile during signup"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 2: Add service role policies for backend operations
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
CREATE POLICY "Service role can manage profiles"
  ON profiles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Step 3: Add invites table policies
DROP POLICY IF EXISTS "Service role can manage invites" ON invites;
CREATE POLICY "Service role can manage invites"
  ON invites
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Step 4: Allow admins to create invites
DROP POLICY IF EXISTS "Admins can insert invites" ON invites;
CREATE POLICY "Admins can insert invites"
  ON invites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Step 5: Allow public read access to invites (for signup process)
DROP POLICY IF EXISTS "Public can read invites" ON invites;
CREATE POLICY "Public can read invites"
  ON invites
  FOR SELECT
  USING (true);

-- Step 6: Verify all policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'invites', 'projects')
ORDER BY tablename, policyname;
```

## What This Fixes

1. **Profile Creation**: Users can now create their own profiles during signup
2. **Service Role Access**: Backend operations using service role key can modify data
3. **Invite Management**: Admins can create invites, and signup process can read them
4. **Authentication Flow**: New users can properly inherit roles from invite table

## Test After Running

1. Try inviting a user through the admin panel
2. Sign up a new user to see if profile is created automatically
3. Check if role inheritance works from invites table

## Common RLS Errors

- "Row Level Security blocked": Missing INSERT policy
- "Permission denied": Using wrong authentication level
- "Policy violation": WITH CHECK condition failed

Run the SQL above and your invite system should work properly!