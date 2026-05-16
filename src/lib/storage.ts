import { supabase } from './supabase.ts';

export const uploadFile = async (file: File, bucket: string = 'clients') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    return { error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { publicUrl, error: null };
};

export const fetchFiles = async (bucket: string = 'clients') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'desc' },
    });

  return { data, error };
};
