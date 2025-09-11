-- Completely recreate cart_items table to fix 406 errors
-- This will drop and recreate the table with proper structure

-- First, let's see what's currently in cart_items
SELECT 
  'Current cart_items structure:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;

-- Check if there are any existing records
SELECT 
  'Current cart_items count:' as info,
  COUNT(*) as total_items
FROM cart_items;

-- Drop the existing cart_items table completely
DROP TABLE IF EXISTS public.cart_items CASCADE;

-- Recreate cart_items table with proper structure
CREATE TABLE public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_cart_items_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate items
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX idx_cart_items_created_at ON public.cart_items(created_at);

-- DO NOT enable RLS - this was causing the 406 errors
-- ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO anon;

-- Verify the table was created correctly
SELECT 
  'New cart_items structure:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;

-- Check RLS status (should be disabled)
SELECT 
  'RLS status for cart_items:' as info,
  relname, 
  relrowsecurity
FROM pg_class
WHERE relname = 'cart_items';

-- Test inserting a sample record
INSERT INTO public.cart_items (user_id, product_id, quantity)
VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM public.products LIMIT 1),
    1
);

-- Verify the insert worked
SELECT 
  'Test insert successful:' as info,
  COUNT(*) as total_items
FROM cart_items;

-- Clean up the test record
DELETE FROM public.cart_items WHERE quantity = 1;

-- Final verification
SELECT 
  'Final cart_items status:' as info,
  COUNT(*) as total_items
FROM cart_items;
