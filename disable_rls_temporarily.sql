-- Temporarily disable RLS to fix infinite recursion
-- This will allow admin to access all data

-- Disable RLS on profiles table temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on orders table temporarily  
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS on cart_items table temporarily
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'orders', 'cart_items');
