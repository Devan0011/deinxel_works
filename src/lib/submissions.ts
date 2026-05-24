import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase.ts';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export type ContactMessageInput = {
  name: string;
  email: string;
  service?: string;
  budget?: string;
  message: string;
};

export type BookingRequestInput = {
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: string;
  project_type?: string;
  budget?: string;
  timeline?: string;
  requirements: string;
  status?: BookingStatus;
};

export const submitContactMessage = async (input: ContactMessageInput) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([input])
    .select('*')
    .single();

  return { data, error };
};

export const submitBookingRequest = async (input: BookingRequestInput) => {
  const bookingPayload = {
    ...input,
    status: input.status || 'pending'
  };

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([bookingPayload])
    .select('*')
    .single();

  if (bookingError) {
    return { booking: null, contactMessage: null, bookingError, contactError: null };
  }

  const { data: contactMessage, error: contactError } = await submitContactMessage({
    name: input.name,
    email: input.email,
    service: input.service_type || input.project_type || 'Custom Project',
    budget: input.budget || '',
    message: input.requirements
  });

  return { booking, contactMessage, bookingError: null, contactError };
};

export const fetchAdminSubmissions = async () => {
  const [inquiriesResult, bookingsResult] = await Promise.all([
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    supabase.from('bookings').select('*').order('created_at', { ascending: false })
  ]);

  return {
    inquiries: inquiriesResult.data,
    inquiriesError: inquiriesResult.error,
    bookings: bookingsResult.data,
    bookingsError: bookingsResult.error
  };
};

export const updateBookingStatus = async (bookingId: string, status: Exclude<BookingStatus, 'pending'>) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select('*')
    .single();

  return { data, error };
};

export const subscribeToAdminSubmissions = (onChange: () => void): RealtimeChannel =>
  supabase
    .channel(`admin-submissions:${crypto.randomUUID()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, onChange)
    .subscribe();
