-- Fix status constraint to allow proper status values
-- First, drop the existing constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_status_check;

-- Add new constraint with proper status values
ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'suspended', 'inactive'));

-- Update existing users with proper status values
UPDATE public.profiles 
SET status = 'approved' 
WHERE status = 'APPROVED' OR status = 'active';

UPDATE public.profiles 
SET status = 'rejected' 
WHERE status = 'REJECTED' OR status = 'suspended';

UPDATE public.profiles 
SET status = 'pending' 
WHERE status IS NULL OR status = '';

-- Verify the constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.profiles'::regclass 
AND conname = 'profiles_status_check';
