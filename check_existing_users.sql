-- Check existing users in auth.users table
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Check existing profiles
SELECT id, email, role, is_active FROM public.profiles ORDER BY created_at DESC LIMIT 10;
