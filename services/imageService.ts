import { createClient } from '@supabase/supabase-js';
import { readAsStringAsync } from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET_NAME = process.env.EXPO_PUBLIC_AWS_S3_BUCKET || 'images';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Pick an image from the user's device
 */
export const pickImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

/**
 * Upload image to Supabase Storage
 * @param imageUri - Local URI of the image
 * @returns Public URL of the uploaded image
 */
export const uploadImageToSupabase = async (
  imageUri: string
): Promise<string> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}.jpg`;

    // Read file as base64
    const base64Data = await readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Supabase expects the data as a string (base64) for file uploads
    // or we can pass it as-is and let it handle the encoding
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, 
        // Convert base64 string to actual binary data
        new Uint8Array(
          atob(base64Data).split('').map(c => c.charCodeAt(0))
        ),
        {
          contentType: 'image/jpeg',
        }
      );

    if (error) {
      console.error('Supabase upload error details:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Implement later for admin use
 * Delete image from Supabase Storage
 * @param fileName - File name to delete
 */
export const deleteImageFromSupabase = async (
  fileName: string
): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
