import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder'); // Dummy for type safety

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing or using placeholders. Please configure SUPABASE_URL and SUPABASE_ANON_KEY in your environment.');
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Booking {
  id: string;
  user_id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  service_type: string;
  project_type?: string | null;
  meeting_date: string;
  meeting_time?: string | null;
  budget?: string | null;
  timeline?: string | null;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  project_name?: string;
  title?: string;
  description?: string | null;
  status: 'pending' | 'in_progress' | 'revision' | 'completed' | 'delivered';
  progress?: number;
  assets?: string[];
  deadline?: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  created_at: string;
}
