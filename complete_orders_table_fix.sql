-- Complete fix for orders table - check all required columns and add missing ones
-- This script will check what columns exist and add all missing required columns

-- First, let's see what columns currently exist in orders table
SELECT 
  'Current orders table structure:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Now let's add ALL missing columns that the application needs
-- Based on the errors we've seen, we need these columns:

-- Add user_email column (for user identification)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_email') THEN
        ALTER TABLE orders ADD COLUMN user_email VARCHAR(255);
        RAISE NOTICE 'Added user_email column';
    ELSE
        RAISE NOTICE 'user_email column already exists';
    END IF;
END $$;

-- Add user_id column (for user identification)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id') THEN
        ALTER TABLE orders ADD COLUMN user_id UUID;
        RAISE NOTICE 'Added user_id column';
    ELSE
        RAISE NOTICE 'user_id column already exists';
    END IF;
END $$;

-- Add company column (for company name)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'company') THEN
        ALTER TABLE orders ADD COLUMN company VARCHAR(255) DEFAULT 'N/A';
        RAISE NOTICE 'Added company column';
    ELSE
        RAISE NOTICE 'company column already exists';
    END IF;
END $$;

-- Add date column (for order date)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'date') THEN
        ALTER TABLE orders ADD COLUMN date DATE DEFAULT CURRENT_DATE;
        RAISE NOTICE 'Added date column';
    ELSE
        RAISE NOTICE 'date column already exists';
    END IF;
END $$;

-- Add discount_percentage column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_percentage') THEN
        ALTER TABLE orders ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0.00;
        RAISE NOTICE 'Added discount_percentage column';
    ELSE
        RAISE NOTICE 'discount_percentage column already exists';
    END IF;
END $$;

-- Add inn column (for tax identification)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'inn') THEN
        ALTER TABLE orders ADD COLUMN inn VARCHAR(50) DEFAULT 'N/A';
        RAISE NOTICE 'Added inn column';
    ELSE
        RAISE NOTICE 'inn column already exists';
    END IF;
END $$;

-- Add shipping_address column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address') THEN
        ALTER TABLE orders ADD COLUMN shipping_address TEXT DEFAULT 'N/A';
        RAISE NOTICE 'Added shipping_address column';
    ELSE
        RAISE NOTICE 'shipping_address column already exists';
    END IF;
END $$;

-- Add total column (for total amount)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total') THEN
        ALTER TABLE orders ADD COLUMN total DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added total column';
    ELSE
        RAISE NOTICE 'total column already exists';
    END IF;
END $$;

-- Update existing rows to set default values for new columns
UPDATE orders 
SET 
    user_email = COALESCE(user_email, 'admin@bilal-parts.com'),
    company = COALESCE(company, 'N/A'),
    date = COALESCE(date, CURRENT_DATE),
    discount_percentage = COALESCE(discount_percentage, 0.00),
    inn = COALESCE(inn, 'N/A'),
    shipping_address = COALESCE(shipping_address, 'N/A'),
    total = COALESCE(total, total_amount, 0.00)
WHERE user_email IS NULL 
   OR company IS NULL 
   OR date IS NULL 
   OR discount_percentage IS NULL 
   OR inn IS NULL 
   OR shipping_address IS NULL 
   OR total IS NULL;

-- Final verification - show the complete structure
SELECT 
  'Final orders table structure:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Show sample data with all columns
SELECT 
  'Sample orders with all columns:' as info,
  id, 
  order_number, 
  user_email,
  user_id,
  company,
  date,
  discount_percentage,
  inn,
  shipping_address,
  total,
  total_amount,
  status
FROM orders 
LIMIT 3;
