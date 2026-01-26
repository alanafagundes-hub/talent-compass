import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type PublicJob = Tables<'jobs'> & {
  area?: Tables<'areas'> | null;
};

/**
 * Hook for public pages to fetch published jobs directly from Supabase.
 * This is the single source of truth for the careers page.
 * Only returns jobs with status='publicada' and is_archived=false.
 */
export function usePublicJobs() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishedJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('jobs')
        .select(`
          *,
          area:areas(*)
        `)
        .eq('status', 'publicada')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Error fetching published jobs:', queryError);
        setError(queryError.message);
        return;
      }

      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching published jobs:', err);
      setError('Erro ao carregar vagas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPublishedJobs();
  }, [fetchPublishedJobs]);

  // Subscribe to realtime changes for automatic sync
  useEffect(() => {
    const channel = supabase
      .channel('public-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
        },
        () => {
          // Refetch when any job changes
          fetchPublishedJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPublishedJobs]);

  // Get job by ID
  const getJobById = useCallback((id: string): PublicJob | undefined => {
    return jobs.find(job => job.id === id);
  }, [jobs]);

  // Fetch a single job by ID (for job detail page)
  const fetchJobById = useCallback(async (id: string): Promise<PublicJob | null> => {
    try {
      const { data, error: queryError } = await supabase
        .from('jobs')
        .select(`
          *,
          area:areas(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (queryError) {
        console.error('Error fetching job by ID:', queryError);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching job by ID:', err);
      return null;
    }
  }, []);

  return {
    jobs,
    isLoading,
    error,
    getJobById,
    fetchJobById,
    refetch: fetchPublishedJobs,
  };
}

/**
 * Hook for public pages to fetch areas from Supabase
 */
export function usePublicAreas() {
  const [areas, setAreas] = useState<Tables<'areas'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('areas')
          .select('*')
          .eq('is_archived', false)
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching areas:', error);
          return;
        }

        setAreas(data || []);
      } catch (err) {
        console.error('Error fetching areas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const getAreaById = useCallback((id: string | null): Tables<'areas'> | undefined => {
    if (!id) return undefined;
    return areas.find(area => area.id === id);
  }, [areas]);

  return {
    areas,
    isLoading,
    getAreaById,
  };
}
