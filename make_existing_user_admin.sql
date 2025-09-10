-- Make an existing user admin
-- First, check which users exist
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Then update the first user to be admin (replace with actual user ID)
-- Example: If you have a user with ID '12345678-1234-1234-1234-123456789012'
-- Replace 'USER_ID_HERE' with the actual user ID from above query

UPDATE public.profiles 
SET 
  role = 'admin',
  is_active = true,
  status = 'active',
  first_name = 'Admin',
  last_name = 'User',
  company_name = 'Bilal Parts',
  updated_at = NOW()
WHERE id = 'USER_ID_HERE'; -- Replace with actual user ID

-- Verify the update
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
