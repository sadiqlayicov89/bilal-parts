-- Complete fix for cart_items table - disable RLS and ensure proper structure
-- This will solve the 406 (Not Acceptable) errors

-- First, check current cart_items structure
SELECT 
  'Current cart_items table structure:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;

-- Check current RLS status
SELECT 
  'Current RLS status for cart_items:' as info,
  relname, 
  relrowsecurity
FROM pg_class
WHERE relname = 'cart_items';

-- Check existing policies
SELECT 
  'Existing RLS policies for cart_items:' as info,
  policyname, 
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'cart_items';

-- Drop ALL existing RLS policies for cart_items
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

-- Disable RLS on the cart_items table
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  'RLS status after disabling for cart_items:' as info,
  relname, 
  relrowsecurity
FROM pg_class
WHERE relname = 'cart_items';

-- Verify no policies exist
SELECT 
  'RLS policies after disabling for cart_items:' as info,
  policyname, 
  permissive
FROM pg_policies
WHERE tablename = 'cart_items';

-- Test cart_items table access
SELECT 
  'Test cart_items access:' as info,
  COUNT(*) as total_items
FROM cart_items;
