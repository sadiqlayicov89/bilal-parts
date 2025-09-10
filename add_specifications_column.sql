-- Add specifications column to products table if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS specifications JSONB;

-- Update existing products with empty specifications if needed
UPDATE public.products 
SET specifications = '{}' 
WHERE specifications IS NULL;
