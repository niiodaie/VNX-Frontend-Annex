-- Setup test accounts with super_admin roles
-- Run this in your Supabase SQL Editor

-- Create or update test accounts with super_admin role
-- Note: These need to be manually created with corresponding auth.users entries
INSERT INTO profiles (id, display_name, role)
VALUES 
  -- These UUIDs should match actual auth.users.id values
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'VIU Media', 'super_admin'),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Niiodaie Gmail', 'super_admin'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Niiodaie Yahoo', 'super_admin'),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Demo Admin', 'super_admin')
ON CONFLICT (id) 
DO UPDATE SET 
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name;

-- Verify the accounts were created/updated
SELECT id, display_name, role, created_at 
FROM profiles 
WHERE role = 'super_admin'
ORDER BY display_name;