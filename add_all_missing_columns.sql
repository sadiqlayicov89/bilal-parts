-- Add ALL missing columns that the application needs
-- This will add any remaining columns that might be missing

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

-- Add ALL potentially missing columns
-- Based on the errors we've seen, we need these additional columns:

-- Add user_name column (for user full name)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_name') THEN
        ALTER TABLE orders ADD COLUMN user_name VARCHAR(255) DEFAULT 'N/A';
        RAISE NOTICE 'Added user_name column';
    ELSE
        RAISE NOTICE 'user_name column already exists';
    END IF;
END $$;

-- Add user_phone column (for user phone)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_phone') THEN
        ALTER TABLE orders ADD COLUMN user_phone VARCHAR(50) DEFAULT 'N/A';
        RAISE NOTICE 'Added user_phone column';
    ELSE
        RAISE NOTICE 'user_phone column already exists';
    END IF;
END $$;

-- Add user_address column (for user address)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_address') THEN
        ALTER TABLE orders ADD COLUMN user_address TEXT DEFAULT 'N/A';
        RAISE NOTICE 'Added user_address column';
    ELSE
        RAISE NOTICE 'user_address column already exists';
    END IF;
END $$;

-- Add payment_method column (for payment method)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(100) DEFAULT 'Credit Card';
        RAISE NOTICE 'Added payment_method column';
    ELSE
        RAISE NOTICE 'payment_method column already exists';
    END IF;
END $$;

-- Add notes column (for order notes)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'notes') THEN
        ALTER TABLE orders ADD COLUMN notes TEXT DEFAULT '';
        RAISE NOTICE 'Added notes column';
    ELSE
        RAISE NOTICE 'notes column already exists';
    END IF;
END $$;

-- Add currency column (for currency)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'currency') THEN
        ALTER TABLE orders ADD COLUMN currency VARCHAR(10) DEFAULT 'USD';
        RAISE NOTICE 'Added currency column';
    ELSE
        RAISE NOTICE 'currency column already exists';
    END IF;
END $$;

-- Add subtotal column (for subtotal amount)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal') THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added subtotal column';
    ELSE
        RAISE NOTICE 'subtotal column already exists';
    END IF;
END $$;

-- Add tax_amount column (for tax amount)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tax_amount') THEN
        ALTER TABLE orders ADD COLUMN tax_amount DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added tax_amount column';
    ELSE
        RAISE NOTICE 'tax_amount column already exists';
    END IF;
END $$;

-- Add shipping_amount column (for shipping amount)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_amount') THEN
        ALTER TABLE orders ADD COLUMN shipping_amount DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added shipping_amount column';
    ELSE
        RAISE NOTICE 'shipping_amount column already exists';
    END IF;
END $$;

-- Add discount_amount column (for discount amount)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
        ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added discount_amount column';
    ELSE
        RAISE NOTICE 'discount_amount column already exists';
    END IF;
END $$;

-- Update existing rows to set default values for new columns
UPDATE orders 
SET 
    user_name = COALESCE(user_name, 'Admin User'),
    user_phone = COALESCE(user_phone, 'N/A'),
    user_address = COALESCE(user_address, 'N/A'),
    payment_method = COALESCE(payment_method, 'Credit Card'),
    notes = COALESCE(notes, ''),
    currency = COALESCE(currency, 'USD'),
    subtotal = COALESCE(subtotal, total_amount, 0.00),
    tax_amount = COALESCE(tax_amount, 0.00),
    shipping_amount = COALESCE(shipping_amount, 0.00),
    discount_amount = COALESCE(discount_amount, 0.00)
WHERE user_name IS NULL 
   OR user_phone IS NULL 
   OR user_address IS NULL 
   OR payment_method IS NULL 
   OR notes IS NULL 
   OR currency IS NULL 
   OR subtotal IS NULL 
   OR tax_amount IS NULL 
   OR shipping_amount IS NULL 
   OR discount_amount IS NULL;

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
  user_name,
  user_email,
  user_phone,
  user_address,
  company,
  inn,
  payment_method,
  currency,
  subtotal,
  tax_amount,
  shipping_amount,
  discount_amount,
  total,
  status
FROM orders 
LIMIT 3;
