import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseArea {
  id: string;
  name: string;
  description: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export function useSupabaseAreas() {
  const [areas, setAreas] = useState<SupabaseArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAreas = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('is_archived', false)
        .order('name');

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return {
    areas,
    isLoading,
    fetchAreas,
  };
}
