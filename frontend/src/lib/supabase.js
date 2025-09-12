import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cjgbbutfxjgjlykuneho.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZ2JidXRmeGpnamx5a3VuZWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMTAwNTIsImV4cCI6MjA3MjY4NjA1Mn0.pr3gK_hcN4wDyF57aFbnZNj0lj-SquD7WhD4r00fXZM';

console.log('Supabase config:', { 
  url: supabaseUrl, 
  key: supabaseAnonKey ? 'Present' : 'Missing' 
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);