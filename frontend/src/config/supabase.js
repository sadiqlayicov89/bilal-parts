import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug: Log configuration
console.log('Supabase Config Debug:');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);
console.log('Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);
console.log('Key starts with:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'undefined');

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;
