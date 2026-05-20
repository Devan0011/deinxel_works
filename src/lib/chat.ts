import { supabase } from './supabase.ts';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string | null;
  content: string;
  file_url?: string | null;
  created_at: string;
}

export const sendMessage = async (content: string, senderId: string, recipientId?: string | null, fileUrl?: string | null) => {
  const { error } = await supabase
    .from('chat_messages')
    .insert([{
      content,
      sender_id: senderId,
      recipient_id: recipientId || null,
      file_url: fileUrl || null
    }]);
  return { error };
};

export const subscribeToMessages = (callback: (payload: any) => void, filterMessage?: (message: Message) => boolean) => {
  const channelName = `public:chat_messages:${crypto.randomUUID()}`;

  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
      const message = payload.new as Message;
      if (!filterMessage || filterMessage(message)) callback(payload);
    })
    .subscribe();
};

export const fetchMessages = async (userId?: string, isAdmin: boolean = false) => {
  let query = supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (userId && !isAdmin) {
    query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
  }

  const { data, error } = await query;
  return { data, error };
};
