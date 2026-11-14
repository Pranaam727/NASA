import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Validates whether realistic Supabase production credentials are provided.
 * When credentials are missing or contain placeholder values, the app runs in DEMO MODE.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes('placeholder') ||
    supabaseUrl.includes('your-project') ||
    supabaseAnonKey.includes('placeholder')
  ) {
    return false;
  }
  return true;
};

export const IS_DEMO_MODE = !isSupabaseConfigured();

/**
 * Connection Status State
 */
export type BackendConnectionStatus = 'DEMO_MODE' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export const getInitialConnectionStatus = (): BackendConnectionStatus => {
  return IS_DEMO_MODE ? 'DEMO_MODE' : 'CONNECTING';
};

/**
 * Centralized Supabase Client.
 * Initialized with safe fallback credentials in Demo Mode to prevent fatal runtime exceptions.
 */
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://demo-mode.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'demo-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Standardized database query error wrapper.
 */
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  isDemoMode: boolean;
}

export const createServiceResponse = <T>(
  data: T | null,
  error: string | null = null
): ServiceResponse<T> => ({
  data,
  error,
  isDemoMode: IS_DEMO_MODE,
});
