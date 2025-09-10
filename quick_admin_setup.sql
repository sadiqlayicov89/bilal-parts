-- Quick admin setup - make first user admin
-- Step 1: Check existing users
SELECT 'Existing auth users:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

SELECT 'Existing profiles:' as info;
SELECT id, email, role, is_active FROM public.profiles ORDER BY created_at DESC LIMIT 5;

-- Step 2: Make the first user admin (if any exist)
-- This will update the most recent user to be admin
UPDATE public.profiles 
SET 
  role = 'admin',
  is_active = true,
  status = 'active',
  first_name = COALESCE(first_name, 'Admin'),
  last_name = COALESCE(last_name, 'User'),
  company_name = COALESCE(company_name, 'Bilal Parts'),
  updated_at = NOW()
WHERE id = (
  SELECT id FROM public.profiles 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Step 3: Verify admin user
SELECT 'Admin user created:' as info;
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
WHERE role = 'admin';
