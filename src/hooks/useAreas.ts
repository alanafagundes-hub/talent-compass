import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Area } from '@/types/ats';

// Database type
interface DbArea {
  id: string;
  name: string;
  description: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

// Map database fields to TypeScript interface
const mapDbAreaToArea = (dbArea: DbArea): Area => ({
  id: dbArea.id,
  name: dbArea.name,
  description: dbArea.description || '',
  isArchived: dbArea.is_archived,
  createdAt: new Date(dbArea.created_at),
  updatedAt: new Date(dbArea.updated_at),
});

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch areas from Supabase
  const fetchAreas = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .order('name');

      if (error) throw error;
      setAreas((data || []).map(mapDbAreaToArea));
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and realtime subscription
  useEffect(() => {
    fetchAreas();

    const channel = supabase
      .channel('areas-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'areas' },
        () => {
          fetchAreas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAreas]);

  // Get areas (non-archived by default)
  const getAreas = useCallback((includeArchived = false) => {
    return includeArchived ? areas : areas.filter(a => !a.isArchived);
  }, [areas]);

  // Get area by ID
  const getAreaById = useCallback((id: string): Area | undefined => {
    return areas.find(area => area.id === id);
  }, [areas]);

  // Create new area
  const createArea = useCallback(async (areaData: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>): Promise<Area | undefined> => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .insert({
          name: areaData.name,
          description: areaData.description || null,
          is_archived: areaData.isArchived || false,
        })
        .select()
        .single();

      if (error) throw error;
      return mapDbAreaToArea(data);
    } catch (error) {
      console.error('Error creating area:', error);
      return undefined;
    }
  }, []);

  // Update area
  const updateArea = useCallback(async (id: string, updates: Partial<Area>): Promise<Area | undefined> => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;

      const { data, error } = await supabase
        .from('areas')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDbAreaToArea(data);
    } catch (error) {
      console.error('Error updating area:', error);
      return undefined;
    }
  }, []);

  // Toggle archive status
  const toggleArchive = useCallback(async (id: string): Promise<Area | undefined> => {
    const area = areas.find(a => a.id === id);
    if (area) {
      return updateArea(id, { isArchived: !area.isArchived });
    }
    return undefined;
  }, [areas, updateArea]);

  return {
    areas,
    isLoading,
    getAreas,
    getAreaById,
    createArea,
    updateArea,
    toggleArchive,
    refetch: fetchAreas,
  };
}

// Export helper for direct usage (fetches fresh from DB)
export const getAreaByIdFromStorage = async (id: string): Promise<Area | undefined> => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapDbAreaToArea(data);
  } catch {
    return undefined;
  }
};
