import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CandidateSource } from '@/types/ats';
import { toast } from 'sonner';

export function useCandidateSources() {
  const [sources, setSources] = useState<CandidateSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('candidate_sources')
        .select('*')
        .order('name');

      if (error) throw error;

      setSources((data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        icon: s.icon || 'link',
        isArchived: s.is_archived,
        createdAt: new Date(s.created_at),
      })));
    } catch (error) {
      console.error('Error fetching candidate sources:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();

    const channel = supabase
      .channel('candidate-sources-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidate_sources' }, fetchSources)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchSources]);

  const createSource = useCallback(async (name: string, icon: string) => {
    try {
      const { error } = await (supabase as any)
        .from('candidate_sources')
        .insert({ name, icon });

      if (error) throw error;
      toast.success('Fonte criada com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error creating source:', error);
      toast.error('Erro ao criar fonte');
      return false;
    }
  }, []);

  const updateSource = useCallback(async (id: string, name: string, icon: string) => {
    try {
      const { error } = await (supabase as any)
        .from('candidate_sources')
        .update({ name, icon })
        .eq('id', id);

      if (error) throw error;
      toast.success('Fonte atualizada!');
      return true;
    } catch (error: any) {
      console.error('Error updating source:', error);
      toast.error('Erro ao atualizar fonte');
      return false;
    }
  }, []);

  const toggleArchive = useCallback(async (id: string) => {
    const source = sources.find(s => s.id === id);
    if (!source) return false;

    try {
      const { error } = await (supabase as any)
        .from('candidate_sources')
        .update({ is_archived: !source.isArchived })
        .eq('id', id);

      if (error) throw error;
      toast.success(source.isArchived ? 'Fonte restaurada!' : 'Fonte arquivada!');
      return true;
    } catch (error: any) {
      console.error('Error toggling archive:', error);
      toast.error('Erro ao arquivar fonte');
      return false;
    }
  }, [sources]);

  return {
    sources,
    activeSources: sources.filter(s => !s.isArchived),
    archivedSources: sources.filter(s => s.isArchived),
    isLoading,
    refetch: fetchSources,
    createSource,
    updateSource,
    toggleArchive,
  };
}
