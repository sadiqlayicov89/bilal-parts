-- Check if orders table has proper foreign key to profiles
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='orders';

-- If no foreign key exists, create one
-- First check if user_id column exists in orders table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public';

-- Add foreign key if it doesn't exist
-- ALTER TABLE public.orders 
-- ADD CONSTRAINT orders_user_id_fkey 
-- FOREIGN KEY (user_id) REFERENCES public.profiles(id);
