-- Create admin user profile
-- First, check if you have a user in auth.users table
-- Then create a profile for that user with admin role

-- Example: If your email is admin@example.com, replace with your actual email
-- First, get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then create/update profile with admin role
-- Replace 'your-user-id-here' with the actual user ID from above query
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  status
) VALUES (
  'your-user-id-here', -- Replace with actual user ID
  'your-email@example.com', -- Replace with your email
  'Admin',
  'User',
  'admin',
  true,
  'active'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true,
  status = 'active';
