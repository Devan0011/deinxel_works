import { supabase } from './supabase.ts';

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const sendMessage = async (content: string, senderId: string) => {
  const { error } = await supabase
    .from('chat_messages')
    .insert([{ content, sender_id: senderId }]);
  return { error };
};

export const subscribeToMessages = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:chat_messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, callback)
    .subscribe();
};

export const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true });
  return { data, error };
};
