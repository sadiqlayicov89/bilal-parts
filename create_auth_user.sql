-- Create auth user for admin@bilal-parts.com
-- Note: This requires superuser privileges, so it's better to use the Dashboard UI

-- First, check if user already exists in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@bilal-parts.com';

-- If no user exists, you need to create it through the Dashboard:
-- Go to Authentication > Users > Add User
-- Email: admin@bilal-parts.com
-- Password: admin
-- Auto Confirm User: Yes

-- After creating the auth user, verify it exists:
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@bilal-parts.com';

-- Then verify the profile exists and is admin:
SELECT 
  id,
  email,
  role,
  is_active,
  status
FROM public.profiles 
WHERE email = 'admin@bilal-parts.com';
