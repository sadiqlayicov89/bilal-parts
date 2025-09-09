-- Fix categories table by adding missing columns
-- Run this in Supabase SQL Editor

-- Add image_url column to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add any other missing columns that might be needed
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Update existing categories to have slug values
UPDATE public.categories 
SET slug = LOWER(REPLACE(name, ' ', '-'))
WHERE slug IS NULL OR slug = '';

-- Make sure slug is not null
ALTER TABLE public.categories 
ALTER COLUMN slug SET NOT NULL;

-- Add any missing indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);
