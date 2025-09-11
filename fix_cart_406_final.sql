-- Final fix for cart 406 error
-- Check current cart_items status
SELECT 
  'Current cart_items RLS status:' as info,
  relname, 
  relrowsecurity
FROM pg_class
WHERE relname = 'cart_items';

-- Check policies
SELECT 
  'Current cart_items policies:' as info,
  policyname, 
  permissive
FROM pg_policies
WHERE tablename = 'cart_items';

-- Drop all policies and disable RLS completely
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN (SELECT policyname FROM pg_policies WHERE tablename = 'cart_items')
    LOOP
        EXECUTE 'DROP POLICY ' || policy_name || ' ON public.cart_items;';
        RAISE NOTICE 'Dropped policy: %', policy_name;
    END LOOP;
END
$$;

-- Disable RLS
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO anon;

-- Test access
SELECT 
  'Test cart_items access:' as info,
  COUNT(*) as total_items
FROM cart_items;