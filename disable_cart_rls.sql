-- Temporarily disable RLS for cart_items to fix 406 errors
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- Verify RLS status
SELECT relname, relrowlevelsecurity FROM pg_class WHERE relname = 'cart_items';
