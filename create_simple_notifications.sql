-- Create simple notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  type TEXT DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS temporarily
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Insert a test notification
INSERT INTO public.notifications (user_id, type, title, message) 
VALUES (NULL, 'info', 'Welcome', 'Admin panel is working!')
ON CONFLICT DO NOTHING;
