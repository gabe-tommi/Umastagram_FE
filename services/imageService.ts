import { createClient } from '@supabase/supabase-js';
import { readAsStringAsync } from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

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
      allowsEditing: false,
      quality: 1,
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
 * Get MIME type from image URI
 */
const getMimeType = (uri: string): string => {
  const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
  };
  return mimeTypes[extension] || 'image/jpeg';
};

/**
 * Get file extension from MIME type and URI
 */
const getFileExtension = (uri: string): string => {
  const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
  return extension;
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
    // Generate unique filename with proper extension
    const timestamp = Date.now();
    const extension = getFileExtension(imageUri);
    const fileName = `${timestamp}.${extension}`;
    const mimeType = getMimeType(imageUri);

    let fileData: Uint8Array | Blob;

    if (Platform.OS === 'web') {
      // On web, fetch the image as a blob
      const response = await fetch(imageUri);
      fileData = await response.blob();
    } else {
      // On mobile, read as base64 and convert to Uint8Array
      const base64Data = await readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
      fileData = new Uint8Array(
        atob(base64Data).split('').map(c => c.charCodeAt(0))
      );
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileData, {
        contentType: mimeType,
      });

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
