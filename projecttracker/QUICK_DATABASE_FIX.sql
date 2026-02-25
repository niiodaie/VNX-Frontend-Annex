-- Quick Fix for RLS Insert Policy Issue
-- Run this in your Supabase SQL Editor to fix profile creation

-- Add missing INSERT policy for profiles table
CREATE POLICY "Users can insert their own profile during signup"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also add policy for service role to insert profiles (for admin operations)
CREATE POLICY "Service role can manage profiles"
  ON profiles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add policy for invites table access
CREATE POLICY "Service role can manage invites"
  ON invites
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow admins to insert invites
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

-- Test the fix by checking if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'invites', 'projects')
ORDER BY tablename, policyname;