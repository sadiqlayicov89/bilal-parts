-- Check cart_items table structure and RLS status
SELECT 
  'cart_items table structure:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;

-- Check RLS status
SELECT 
  'cart_items RLS status:' as info,
  relname, 
  relrowsecurity
FROM pg_class
WHERE relname = 'cart_items';

-- Check if there are any policies
SELECT 
  'cart_items policies:' as info,
  policyname, 
  permissive
FROM pg_policies
WHERE tablename = 'cart_items';

-- Test simple select
SELECT 
  'cart_items test select:' as info,
  COUNT(*) as total_items
FROM cart_items;
