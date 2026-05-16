import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co';

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder'); // Dummy for type safety

if (!isConfigured) {
  console.warn('Supabase credentials missing or using placeholders. Please configure SUPABASE_URL and SUPABASE_ANON_KEY in your secrets.');
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
  user_id: string;
  service_type: string;
  meeting_date: string;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  project_name: string;
  status: 'pending' | 'in_progress' | 'revision' | 'completed' | 'delivered';
  progress: number;
  assets: string[];
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
