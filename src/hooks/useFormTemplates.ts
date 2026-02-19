import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { FormTemplate, FormField, FormFieldType } from '@/types/ats';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface DbFormTemplate {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

interface DbFormField {
  id: string;
  template_id: string;
  label: string;
  field_type: string;
  is_required: boolean;
  order_index: number;
  placeholder: string | null;
  options: string[] | null;
}

export function useFormTemplates() {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('form_templates')
        .select('*')
        .order('name');

      if (templatesError) throw templatesError;

      // Fetch all fields for these templates
      const templateIds = (templatesData || []).map(t => t.id);
      
      let fieldsData: DbFormField[] = [];
      if (templateIds.length > 0) {
        const { data: fields, error: fieldsError } = await supabase
          .from('form_fields')
          .select('*')
          .in('template_id', templateIds)
          .order('order_index');

        if (fieldsError) throw fieldsError;
        fieldsData = (fields || []) as DbFormField[];
      }

      // Group fields by template
      const fieldsByTemplate: Record<string, FormField[]> = {};
      for (const field of fieldsData) {
        if (!fieldsByTemplate[field.template_id]) {
          fieldsByTemplate[field.template_id] = [];
        }
        fieldsByTemplate[field.template_id].push({
          id: field.id,
          label: field.label,
          type: field.field_type as FormFieldType,
          required: field.is_required,
          order: field.order_index,
          placeholder: field.placeholder || undefined,
          options: field.options || undefined,
        });
      }

      // Map to FormTemplate type
      const mappedTemplates: FormTemplate[] = (templatesData || []).map((t: DbFormTemplate) => ({
        id: t.id,
        name: t.name,
        description: t.description || undefined,
        isDefault: t.is_default,
        isArchived: t.is_archived,
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at),
        fields: fieldsByTemplate[t.id] || [],
      }));

      setTemplates(mappedTemplates);
    } catch (err: any) {
      console.error('Error fetching form templates:', err);
      setError(err.message || 'Erro ao carregar templates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (
    data: { name: string; description?: string; isDefault: boolean; fields: FormField[] }
  ) => {
    try {
      // If setting as default, unset other defaults first
      if (data.isDefault) {
        await supabase
          .from('form_templates')
          .update({ is_default: false })
          .eq('is_default', true);
      }

      // Create template
      const { data: newTemplate, error: templateError } = await supabase
        .from('form_templates')
        .insert({
          name: data.name,
          description: data.description || null,
          is_default: data.isDefault,
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Create fields
      if (data.fields.length > 0) {
        const fieldsToInsert = data.fields.map((field, index) => ({
          template_id: newTemplate.id,
          label: field.label,
          field_type: field.type,
          is_required: field.required,
          order_index: index + 1,
          placeholder: field.placeholder || null,
          options: field.options || null,
        }));

        const { error: fieldsError } = await supabase
          .from('form_fields')
          .insert(fieldsToInsert);

        if (fieldsError) throw fieldsError;
      }

      await fetchTemplates();
      toast.success('Template criado com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error creating template:', err);
      toast.error('Erro ao criar template');
      return false;
    }
  }, [fetchTemplates]);

  const updateTemplate = useCallback(async (
    id: string,
    data: { name: string; description?: string; isDefault: boolean; fields: FormField[] }
  ) => {
    try {
      // If setting as default, unset other defaults first
      if (data.isDefault) {
        await supabase
          .from('form_templates')
          .update({ is_default: false })
          .neq('id', id);
      }

      // Update template
      const { error: templateError } = await supabase
        .from('form_templates')
        .update({
          name: data.name,
          description: data.description || null,
          is_default: data.isDefault,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (templateError) throw templateError;

      // Delete existing fields and recreate
      await supabase.from('form_fields').delete().eq('template_id', id);

      if (data.fields.length > 0) {
        const fieldsToInsert = data.fields.map((field, index) => ({
          template_id: id,
          label: field.label,
          field_type: field.type,
          is_required: field.required,
          order_index: index + 1,
          placeholder: field.placeholder || null,
          options: field.options || null,
        }));

        const { error: fieldsError } = await supabase
          .from('form_fields')
          .insert(fieldsToInsert);

        if (fieldsError) throw fieldsError;
      }

      await fetchTemplates();
      toast.success('Template atualizado com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Error updating template:', err);
      toast.error('Erro ao atualizar template');
      return false;
    }
  }, [fetchTemplates]);

  const toggleArchive = useCallback(async (id: string) => {
    try {
      const template = templates.find(t => t.id === id);
      if (!template) return false;

      const { error } = await supabase
        .from('form_templates')
        .update({ is_archived: !template.isArchived })
        .eq('id', id);

      if (error) throw error;

      await fetchTemplates();
      toast.success(template.isArchived ? 'Template restaurado!' : 'Template arquivado!');
      return true;
    } catch (err: any) {
      console.error('Error toggling archive:', err);
      toast.error('Erro ao arquivar template');
      return false;
    }
  }, [templates, fetchTemplates]);

  const duplicateTemplate = useCallback(async (id: string) => {
    try {
      const template = templates.find(t => t.id === id);
      if (!template) return false;

      await createTemplate({
        name: `${template.name} (Cópia)`,
        description: template.description,
        isDefault: false,
        fields: template.fields,
      });

      return true;
    } catch (err: any) {
      console.error('Error duplicating template:', err);
      toast.error('Erro ao duplicar template');
      return false;
    }
  }, [templates, createTemplate]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates,
    createTemplate,
    updateTemplate,
    toggleArchive,
    duplicateTemplate,
  };
}
