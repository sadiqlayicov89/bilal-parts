-- Check if admin user exists in auth.users
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@bilal-parts.com';

-- Check if admin profile exists
SELECT id, email, role, is_active, status 
FROM public.profiles 
WHERE email = 'admin@bilal-parts.com';
