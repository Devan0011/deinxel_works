import { supabase } from './supabase.ts';

type UploadOptions = {
  bucket?: string;
  userId?: string;
  folder?: string;
};

const cleanPathPart = (value: string) =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const cleanFolderPath = (value: string) =>
  value
    .split('/')
    .map(cleanPathPart)
    .filter(Boolean)
    .join('/');

const buildFilePath = (file: File, userId?: string, folder?: string) => {
  const fileExt = cleanPathPart(file.name.split('.').pop() || 'bin').toLowerCase();
  const baseName = cleanPathPart(file.name.replace(/\.[^/.]+$/, '')) || 'asset';
  const safeFolder = cleanFolderPath(folder || userId || 'shared');
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

  return `${safeFolder}/${baseName}-${uniqueName}`;
};

export const uploadFile = async (file: File, options: UploadOptions | string = {}) => {
  const settings = typeof options === 'string' ? { bucket: options } : options;
  const bucket = settings.bucket || 'clients';
  const filePath = buildFilePath(file, settings.userId, settings.folder);

  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    return { error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { publicUrl, path: data.path, error: null };
};

export const fetchFiles = async (bucket: string = 'clients', folder: string = '') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'desc' },
    });

  return { data, error };
};

export const getFileUrl = (path: string, bucket: string = 'clients') =>
  supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
