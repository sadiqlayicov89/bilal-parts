-- Fix infinite recursion in RLS policies
-- Drop problematic admin policies first
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON public.orders;

-- Create simpler admin policies without recursion
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin can update all orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );
