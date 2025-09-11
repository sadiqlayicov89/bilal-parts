-- Completely recreate cart_items table to fix 406 errors
-- First, backup existing data (if any)
CREATE TABLE IF NOT EXISTS cart_items_backup AS 
SELECT * FROM cart_items;

-- Drop existing cart_items table
DROP TABLE IF EXISTS cart_items CASCADE;

-- Recreate cart_items table with proper structure
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Users can manage their own cart items" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Policy for admins to see all cart items
CREATE POLICY "Admins can view all cart items" ON cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR email = 'admin@bilal-parts.com')
    )
  );

-- Verify table structure
SELECT 
  'cart_items table structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;

-- Verify RLS policies
SELECT 
  'cart_items RLS policies:' as info,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'cart_items';
