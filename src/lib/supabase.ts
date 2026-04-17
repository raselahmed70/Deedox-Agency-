import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}.${ext}`
  
  const { error } = await supabase.storage
    .from('deedox-images')
    .upload(path, file, { upsert: true })
    
  if (error) throw error
  
  const { data } = supabase.storage
    .from('deedox-images')
    .getPublicUrl(path)
    
  return data.publicUrl
}
