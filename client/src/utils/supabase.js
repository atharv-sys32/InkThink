import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name
export const STORAGE_BUCKET = 'InkThink-img';

// InkThink Logo URL (you'll upload this to Supabase Storage)
export const INKTHINK_LOGO_URL = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/inkthink-logo.png`;

/**
 * Upload file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder path (e.g., 'categories', 'posts')
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadFile = async (file, folder = '') => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete file from Supabase Storage (optional - not used in simple approach)
 * @param {string} filePath - The path of the file to delete
 */
export const deleteFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get public URL for a file
 * @param {string} filePath - The path of the file
 * @returns {string} - Public URL
 */
export const getPublicUrl = (filePath) => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};
