import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { EmailTemplate, EmailTemplateType } from '@/types/ats';
import { toast } from 'sonner';

export function useEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) throw error;

      setTemplates((data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        type: t.type as EmailTemplateType,
        subject: t.subject,
        body: t.body,
        isDefault: t.is_default,
        isArchived: t.is_archived,
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at),
      })));
    } catch (error) {
      console.error('Error fetching email templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();

    const channel = supabase
      .channel('email-templates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'email_templates' }, fetchTemplates)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchTemplates]);

  const createTemplate = useCallback(async (data: {
    name: string; type: EmailTemplateType; subject: string; body: string; isDefault: boolean;
  }) => {
    try {
      if (data.isDefault) {
        await (supabase as any).from('email_templates').update({ is_default: false }).eq('type', data.type).eq('is_default', true);
      }

      const { error } = await (supabase as any)
        .from('email_templates')
        .insert({
          name: data.name,
          type: data.type,
          subject: data.subject,
          body: data.body,
          is_default: data.isDefault,
        });

      if (error) throw error;
      toast.success('Template criado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast.error('Erro ao criar template');
      return false;
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, data: {
    name: string; type: EmailTemplateType; subject: string; body: string; isDefault: boolean;
  }) => {
    try {
      if (data.isDefault) {
        await (supabase as any).from('email_templates').update({ is_default: false }).eq('type', data.type).eq('is_default', true).neq('id', id);
      }

      const { error } = await (supabase as any)
        .from('email_templates')
        .update({
          name: data.name,
          type: data.type,
          subject: data.subject,
          body: data.body,
          is_default: data.isDefault,
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Template atualizado!');
      return true;
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast.error('Erro ao atualizar template');
      return false;
    }
  }, []);

  const toggleArchive = useCallback(async (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return false;

    try {
      const { error } = await (supabase as any)
        .from('email_templates')
        .update({ is_archived: !template.isArchived })
        .eq('id', id);

      if (error) throw error;
      toast.success(template.isArchived ? 'Template restaurado!' : 'Template arquivado!');
      return true;
    } catch (error: any) {
      console.error('Error toggling archive:', error);
      toast.error('Erro ao arquivar template');
      return false;
    }
  }, [templates]);

  const duplicateTemplate = useCallback(async (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return false;

    return createTemplate({
      name: `${template.name} (Cópia)`,
      type: template.type,
      subject: template.subject,
      body: template.body,
      isDefault: false,
    });
  }, [templates, createTemplate]);

  return {
    templates,
    activeTemplates: templates.filter(t => !t.isArchived),
    archivedTemplates: templates.filter(t => t.isArchived),
    isLoading,
    refetch: fetchTemplates,
    createTemplate,
    updateTemplate,
    toggleArchive,
    duplicateTemplate,
  };
}
