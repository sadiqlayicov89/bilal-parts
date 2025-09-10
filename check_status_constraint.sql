-- Check the status constraint on profiles table
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.profiles'::regclass 
AND conname LIKE '%status%';

-- Check current status values in profiles
SELECT DISTINCT status FROM public.profiles;
