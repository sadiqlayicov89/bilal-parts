-- Simple admin user creation
-- Login: admin@bilalparts.com
-- Password: admin

-- First, create the auth user through Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@bilalparts.com
-- 4. Password: admin
-- 5. Check "Auto Confirm User"
-- 6. Click "Create User"

-- Then run this SQL to create the profile:
-- (Replace the UUID below with the actual user ID from auth.users)

INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  status,
  phone,
  company_name,
  country,
  city,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@bilalparts.com'),
  'admin@bilalparts.com',
  'Admin',
  'User',
  'admin',
  true,
  'active',
  '+994501234567',
  'Bilal Parts',
  'Azerbaijan',
  'Baku',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true,
  status = 'active',
  first_name = 'Admin',
  last_name = 'User',
  company_name = 'Bilal Parts',
  updated_at = NOW();

-- Verify the admin user was created
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  status,
  company_name,
  created_at
FROM public.profiles 
WHERE email = 'admin@bilalparts.com';
