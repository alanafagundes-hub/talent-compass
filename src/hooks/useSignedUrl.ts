import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Parse Supabase storage URL to extract bucket and path
 * Handles both public and signed URL formats
 */
function parseStorageUrl(url: string): { bucket: string; path: string } | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // URL formats:
    // - /storage/v1/object/public/{bucket}/{path}
    // - /storage/v1/object/sign/{bucket}/{path}
    // - /storage/v1/object/{bucket}/{path}
    
    const match = pathname.match(/\/storage\/v1\/object(?:\/(?:public|sign))?\/([^/]+)\/(.+)/);
    
    if (match) {
      return {
        bucket: match[1],
        path: decodeURIComponent(match[2])
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

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
        const parsed = parseStorageUrl(publicUrl);
        
        if (!parsed) {
          console.error('Could not parse storage URL:', publicUrl);
          setSignedUrl(publicUrl);
          return;
        }

        const { bucket, path } = parsed;
        console.log('Generating signed URL for:', { bucket, path });

        // Generate signed URL
        const { data, error: signError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, expiresIn);

        if (signError) {
          console.error('Error creating signed URL:', signError);
          setError(signError.message);
          // Fallback to original URL
          setSignedUrl(publicUrl);
        } else if (data?.signedUrl) {
          console.log('Signed URL generated successfully');
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
    const parsed = parseStorageUrl(publicUrl);
    
    if (!parsed) {
      console.error('Could not parse storage URL:', publicUrl);
      return publicUrl;
    }

    const { bucket, path } = parsed;
    console.log('getSignedUrl - Generating for:', { bucket, path });

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

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
