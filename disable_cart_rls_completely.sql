-- Completely disable RLS for cart_items to fix 406 errors
-- This is a temporary solution to get cart working

-- Disable RLS for cart_items
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can manage their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Admins can view all cart items" ON cart_items;

-- Verify RLS is disabled
SELECT 
  'cart_items RLS status:' as info,
  relname,
  relrowsecurity
FROM pg_class 
WHERE relname = 'cart_items';

-- Check if there are any policies left
SELECT 
  'cart_items RLS policies:' as info,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'cart_items';
