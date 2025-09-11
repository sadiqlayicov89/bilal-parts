-- Fix cart_items foreign key relationship with products table
-- This will solve the PGRST200 error

-- First, let's check the current structure
SELECT 
  'Current cart_items structure:' as info,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if products table exists and has id column
SELECT 
  'Products table structure:' as info,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND table_schema = 'public'
  AND column_name = 'id'
ORDER BY ordinal_position;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  -- Check if foreign key constraint exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey'
    AND table_name = 'cart_items'
  ) THEN
    -- Add foreign key constraint
    ALTER TABLE public.cart_items 
    ADD CONSTRAINT cart_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Foreign key constraint added successfully';
  ELSE
    RAISE NOTICE 'Foreign key constraint already exists';
  END IF;
END $$;

-- Test the relationship
SELECT 
  'Testing cart_items with products:' as info,
  ci.id,
  ci.user_id,
  ci.product_id,
  ci.quantity,
  p.name as product_name
FROM cart_items ci
LEFT JOIN products p ON ci.product_id = p.id
LIMIT 5;
