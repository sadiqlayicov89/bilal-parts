-- Update existing admin@bilal-parts.com user to be admin
UPDATE public.profiles 
SET 
  role = 'admin',
  is_active = true,
  status = 'active',
  first_name = 'Admin',
  last_name = 'User',
  company_name = 'Bilal Parts',
  phone = '+994501234567',
  country = 'Azerbaijan',
  city = 'Baku',
  updated_at = NOW()
WHERE email = 'admin@bilal-parts.com';

-- Verify the update
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  status,
  company_name,
  phone,
  country,
  city
FROM public.profiles 
WHERE email = 'admin@bilal-parts.com';
