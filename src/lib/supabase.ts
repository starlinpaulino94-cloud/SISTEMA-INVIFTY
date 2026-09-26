import { createClient } from '@supabase/supabase-js';

// Retrieve configuration from Vite client environment or fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-invifty-cluster.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Centralized permission validation helpers
export async function requireUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('UNAUTHORIZED_REQUIRES_LOGIN');
  }
  return user;
}

export async function requireStudioUser() {
  const user = await requireUser();
  const isStudioStaff = user.email?.endsWith('@invifty.com') || user.app_metadata?.role === 'studio_operator';
  if (!isStudioStaff) {
    throw new Error('FORBIDDEN_STUDIO_ACCESS_REQUIRED');
  }
  return user;
}
