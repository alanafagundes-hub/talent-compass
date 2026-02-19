import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { IncompatibilityReason } from '@/types/ats';
import { toast } from 'sonner';

export function useIncompatibilityReasons() {
  const [reasons, setReasons] = useState<IncompatibilityReason[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReasons = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('incompatibility_reasons')
        .select('*')
        .order('name');

      if (error) throw error;

      setReasons((data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        isArchived: r.is_archived,
        createdAt: new Date(r.created_at),
      })));
    } catch (error) {
      console.error('Error fetching incompatibility reasons:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReasons();

    const channel = supabase
      .channel('incompatibility-reasons-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incompatibility_reasons' }, fetchReasons)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchReasons]);

  const createReason = useCallback(async (name: string, description: string) => {
    try {
      const { error } = await (supabase as any)
        .from('incompatibility_reasons')
        .insert({ name, description: description || null });

      if (error) throw error;
      toast.success('Motivo criado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error creating reason:', error);
      toast.error('Erro ao criar motivo');
      return false;
    }
  }, []);

  const updateReason = useCallback(async (id: string, name: string, description: string) => {
    try {
      const { error } = await (supabase as any)
        .from('incompatibility_reasons')
        .update({ name, description: description || null })
        .eq('id', id);

      if (error) throw error;
      toast.success('Motivo atualizado!');
      return true;
    } catch (error: any) {
      console.error('Error updating reason:', error);
      toast.error('Erro ao atualizar motivo');
      return false;
    }
  }, []);

  const toggleArchive = useCallback(async (id: string) => {
    const reason = reasons.find(r => r.id === id);
    if (!reason) return false;

    try {
      const { error } = await (supabase as any)
        .from('incompatibility_reasons')
        .update({ is_archived: !reason.isArchived })
        .eq('id', id);

      if (error) throw error;
      toast.success(reason.isArchived ? 'Motivo restaurado!' : 'Motivo arquivado!');
      return true;
    } catch (error: any) {
      console.error('Error toggling archive:', error);
      toast.error('Erro ao arquivar motivo');
      return false;
    }
  }, [reasons]);

  return {
    reasons,
    activeReasons: reasons.filter(r => !r.isArchived),
    archivedReasons: reasons.filter(r => r.isArchived),
    isLoading,
    refetch: fetchReasons,
    createReason,
    updateReason,
    toggleArchive,
  };
}
