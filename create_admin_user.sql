-- Create admin user with login: admin, password: admin
-- This will create both auth user and profile

-- Step 1: Create auth user (if not exists)
-- Note: You need to create this user through Supabase Auth UI first
-- Go to Authentication > Users > Add User
-- Email: admin@bilalparts.com
-- Password: admin
-- Auto Confirm User: Yes

-- Step 2: After creating the auth user, get the user ID
SELECT id, email FROM auth.users WHERE email = 'admin@bilalparts.com';

-- Step 3: Create/update profile with admin role
-- Replace 'USER_ID_FROM_STEP_2' with the actual user ID from above query
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
  city
) VALUES (
  'USER_ID_FROM_STEP_2', -- Replace with actual user ID from step 2
  'admin@bilalparts.com',
  'Admin',
  'User',
  'admin',
  true,
  'active',
  '+994501234567',
  'Bilal Parts',
  'Azerbaijan',
  'Baku'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true,
  status = 'active',
  first_name = 'Admin',
  last_name = 'User',
  company_name = 'Bilal Parts';

-- Step 4: Verify admin user was created
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  status,
  company_name
FROM public.profiles 
WHERE email = 'admin@bilalparts.com';
