-- Check if admin user exists and has correct role
SELECT 
  id,
  email,
  role,
  is_active,
  created_at
FROM public.profiles 
WHERE role = 'admin' 
ORDER BY created_at DESC;

-- If no admin user found, check all users
SELECT 
  id,
  email,
  role,
  is_active,
  created_at
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 10;
