import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to generate signed URLs for private storage files
 * Returns a signed URL that's valid for the specified duration
 */
export function useSignedUrl(publicUrl: string | null | undefined, expiresIn: number = 3600) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSignedUrl = async () => {
      if (!publicUrl) {
        setSignedUrl(null);
        return;
      }

      // Check if this is a Supabase storage URL that needs signing
      const isSupabaseStorage = publicUrl.includes('supabase.co/storage');
      
      if (!isSupabaseStorage) {
        // Not a Supabase URL, use as-is
        setSignedUrl(publicUrl);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Extract bucket and path from the URL
        // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
        const urlObj = new URL(publicUrl);
        const pathParts = urlObj.pathname.split('/');
        
        // Find the bucket name and file path
        const storageIndex = pathParts.indexOf('object');
        if (storageIndex === -1) {
          setSignedUrl(publicUrl);
          return;
        }

        // Path structure: /storage/v1/object/public/bucket/path/to/file
        const bucketAndPath = pathParts.slice(storageIndex + 2); // Skip 'object' and 'public'
        const bucket = bucketAndPath[0];
        const filePath = bucketAndPath.slice(1).join('/');

        if (!bucket || !filePath) {
          setSignedUrl(publicUrl);
          return;
        }

        // Generate signed URL
        const { data, error: signError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, expiresIn);

        if (signError) {
          console.error('Error creating signed URL:', signError);
          setError(signError.message);
          // Fallback to original URL
          setSignedUrl(publicUrl);
        } else if (data?.signedUrl) {
          setSignedUrl(data.signedUrl);
        } else {
          setSignedUrl(publicUrl);
        }
      } catch (err) {
        console.error('Error parsing URL for signing:', err);
        setError('Failed to generate signed URL');
        setSignedUrl(publicUrl);
      } finally {
        setIsLoading(false);
      }
    };

    generateSignedUrl();
  }, [publicUrl, expiresIn]);

  return { signedUrl, isLoading, error };
}

/**
 * Utility function to get a signed URL synchronously (returns a promise)
 * Useful for one-off URL generation
 */
export async function getSignedUrl(publicUrl: string, expiresIn: number = 3600): Promise<string> {
  if (!publicUrl) return '';

  const isSupabaseStorage = publicUrl.includes('supabase.co/storage');
  if (!isSupabaseStorage) return publicUrl;

  try {
    const urlObj = new URL(publicUrl);
    const pathParts = urlObj.pathname.split('/');
    
    const storageIndex = pathParts.indexOf('object');
    if (storageIndex === -1) return publicUrl;

    const bucketAndPath = pathParts.slice(storageIndex + 2);
    const bucket = bucketAndPath[0];
    const filePath = bucketAndPath.slice(1).join('/');

    if (!bucket || !filePath) return publicUrl;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error || !data?.signedUrl) {
      console.error('Error creating signed URL:', error);
      return publicUrl;
    }

    return data.signedUrl;
  } catch (err) {
    console.error('Error parsing URL for signing:', err);
    return publicUrl;
  }
}
