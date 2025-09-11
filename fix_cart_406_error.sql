-- Check cart_items table structure and RLS policies
SELECT 
  'cart_items table structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;

-- Check RLS policies for cart_items
SELECT 
  'cart_items RLS policies:' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'cart_items';

-- Temporarily disable RLS for cart_items to test
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Check if RLS is disabled
SELECT 
  'cart_items RLS status:' as info,
  relname,
  relrowsecurity
FROM pg_class 
WHERE relname = 'cart_items';
