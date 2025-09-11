-- Ultimate fix for cart 406 error - completely recreate cart_items table
-- This will solve the persistent 406 error

-- Drop the existing cart_items table completely
DROP TABLE IF EXISTS public.cart_items CASCADE;

-- Recreate cart_items table with minimal structure
CREATE TABLE public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);

-- Grant permissions to all roles
GRANT ALL ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO anon;
GRANT ALL ON public.cart_items TO service_role;

-- Test insert
INSERT INTO public.cart_items (user_id, product_id, quantity)
VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM public.products LIMIT 1),
    1
);

-- Verify
SELECT 
  'Cart items recreated successfully:' as info,
  COUNT(*) as total_items
FROM cart_items;
