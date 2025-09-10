-- Delete existing admin user if exists
DELETE FROM public.profiles WHERE email = 'admin@bilal-parts.com';
DELETE FROM auth.users WHERE email = 'admin@bilal-parts.com';

-- Note: You need to create the auth user through Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@bilal-parts.com
-- 4. Password: admin
-- 5. Check "Auto Confirm User"
-- 6. Click "Create User"

-- After creating auth user, run this to create profile:
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
  (SELECT id FROM auth.users WHERE email = 'admin@bilal-parts.com'),
  'admin@bilal-parts.com',
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
);

-- Verify admin user was created
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.is_active,
  p.status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@bilal-parts.com';
