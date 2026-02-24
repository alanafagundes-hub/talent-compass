import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fromTable } from '@/integrations/supabase/db-helper';

export interface PublicJob {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  level: string;
  contract_type: string;
  work_model: string;
  location: string;
  about_job: string | null;
  about_company: string | null;
  responsibilities: string | null;
  requirements_text: string | null;
  nice_to_have: string | null;
  additional_info: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: string;
  priority: string;
  area_id: string | null;
  form_template_id: string | null;
  deadline: string | null;
  is_archived: boolean;
  is_boosted: boolean;
  investment_amount: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  closed_at: string | null;
  is_remote: boolean;
  area?: {
    id: string;
    name: string;
    description: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  [key: string]: any;
}

/**
 * Hook for public pages to fetch published jobs directly.
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

      const { data, error: queryError } = await fromTable('jobs')
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

  useEffect(() => {
    fetchPublishedJobs();
  }, [fetchPublishedJobs]);

  useEffect(() => {
    const channel = supabase
      .channel('public-jobs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => { fetchPublishedJobs(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPublishedJobs]);

  const getJobById = useCallback((id: string): PublicJob | undefined => {
    return jobs.find(job => job.id === id);
  }, [jobs]);

  const fetchJobById = useCallback(async (id: string): Promise<PublicJob | null> => {
    try {
      const { data, error: queryError } = await fromTable('jobs')
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
 * Hook for public pages to fetch areas
 */
export function usePublicAreas() {
  const [areas, setAreas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data, error } = await fromTable('areas')
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

  const getAreaById = useCallback((id: string | null): any | undefined => {
    if (!id) return undefined;
    return areas.find(area => area.id === id);
  }, [areas]);

  return {
    areas,
    isLoading,
    getAreaById,
  };
}
