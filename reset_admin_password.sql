-- Reset admin user password
-- Note: This requires superuser privileges, so it's better to use the Dashboard UI

-- Check current user status
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'admin@bilal-parts.com';

-- If email_confirmed_at is NULL, the user needs to confirm their email
-- You can manually confirm in Dashboard or use this (requires superuser):
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'admin@bilal-parts.com';
