import { useState, useEffect, useCallback } from 'react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Cast to any to bypass type errors for tables not yet in types.ts
const supabase = supabaseClient as any;
import type { Tag } from '@/types/ats';

interface DbTag {
  id: string;
  name: string;
  color: string;
  is_archived: boolean;
  created_at: string;
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      const mappedTags: Tag[] = (data || []).map((t: DbTag) => ({
        id: t.id,
        name: t.name,
        color: t.color,
        isArchived: t.is_archived,
        createdAt: new Date(t.created_at),
      }));

      setTags(mappedTags);
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      setError(err.message || 'Erro ao carregar etiquetas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTag = useCallback(async (name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({ name, color })
        .select()
        .single();

      if (error) throw error;

      const newTag: Tag = {
        id: data.id,
        name: data.name,
        color: data.color,
        isArchived: data.is_archived,
        createdAt: new Date(data.created_at),
      };

      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err: any) {
      console.error('Error creating tag:', err);
      return null;
    }
  }, []);

  const updateTag = useCallback(async (id: string, name: string, color: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ name, color })
        .eq('id', id);

      if (error) throw error;

      setTags(prev => prev.map(t =>
        t.id === id ? { ...t, name, color } : t
      ));
      return true;
    } catch (err: any) {
      console.error('Error updating tag:', err);
      return false;
    }
  }, []);

  const archiveTag = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;

      setTags(prev => prev.map(t =>
        t.id === id ? { ...t, isArchived: true } : t
      ));
      return true;
    } catch (err: any) {
      console.error('Error archiving tag:', err);
      return false;
    }
  }, []);

  const restoreTag = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ is_archived: false })
        .eq('id', id);

      if (error) throw error;

      setTags(prev => prev.map(t =>
        t.id === id ? { ...t, isArchived: false } : t
      ));
      return true;
    } catch (err: any) {
      console.error('Error restoring tag:', err);
      return false;
    }
  }, []);

  // Add tag to application
  const addTagToApplication = useCallback(async (applicationId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('application_tags')
        .insert({ application_id: applicationId, tag_id: tagId });

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error adding tag to application:', err);
      return false;
    }
  }, []);

  // Remove tag from application
  const removeTagFromApplication = useCallback(async (applicationId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('application_tags')
        .delete()
        .eq('application_id', applicationId)
        .eq('tag_id', tagId);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error removing tag from application:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('tags-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, fetchTags)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTags]);

  return {
    tags,
    activeTags: tags.filter(t => !t.isArchived),
    archivedTags: tags.filter(t => t.isArchived),
    isLoading,
    error,
    refetch: fetchTags,
    createTag,
    updateTag,
    archiveTag,
    restoreTag,
    addTagToApplication,
    removeTagFromApplication,
  };
}
