import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://stlrender.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bHJlbmRlciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk5MzQ4NTI3LCJleHAiOjIwMTQ5MjQ1Mjd9.PmWJtj0vxL_zJ-QX1Zj_ZPgHi8RqHHBpMHsKoNvn5Yw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});