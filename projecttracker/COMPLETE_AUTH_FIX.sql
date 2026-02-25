-- Complete Authentication Fix for Nexus Tracker
-- Run this entire script in your Supabase SQL Editor

-- ============================================================================
-- STEP 1: Fix Authentication Trigger Function
-- ============================================================================

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_profile();

-- Create the profile creation trigger function
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with proper error handling
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name',
      NEW.email,
      'New User'
    ),
    'user'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_profile();

-- ============================================================================
-- STEP 2: Configure Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Enable profile creation during signup" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable profile creation during signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- STEP 3: Grant Necessary Permissions
-- ============================================================================

-- Grant permissions for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Grant permissions for the trigger function
GRANT INSERT ON public.profiles TO service_role;

-- ============================================================================
-- STEP 4: Test the Setup
-- ============================================================================

-- Test that the trigger function exists
SELECT 
  'Trigger function created successfully' as status,
  proname as function_name
FROM pg_proc 
WHERE proname = 'handle_new_profile';

-- Check RLS policies
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN roles = '{authenticated}' THEN 'authenticated users'
    WHEN roles = '{anon}' THEN 'anonymous users'
    ELSE array_to_string(roles, ', ')
  END as applies_to
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd;

-- Verify table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- STEP 5: Demo Admin Account Setup
-- ============================================================================

-- Create demo admin accounts (for testing)
INSERT INTO profiles (id, display_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Demo Super Admin', 'super_admin'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Demo Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'Authentication setup completed successfully!' as final_status;