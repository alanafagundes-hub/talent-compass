import { useState, useEffect, useCallback } from 'react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const supabase = supabaseClient as any;

export interface AccessProfile {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  base_role: string;
  is_active: boolean;
  created_at: string;
}

export interface Module {
  id: string;
  name: string;
  display_name: string;
  icon: string | null;
  is_active: boolean;
}

export interface ModulePermission {
  id: string;
  role_id: string;
  module_id: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export function useAccessProfiles() {
  const [profiles, setProfiles] = useState<AccessProfile[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [profilesRes, modulesRes, permissionsRes] = await Promise.all([
        supabase.from('custom_roles').select('*').order('display_name'),
        supabase.from('modules').select('*').eq('is_active', true).like('name', 'ats_%').order('display_name'),
        supabase.from('role_module_permissions').select('*'),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (modulesRes.error) throw modulesRes.error;
      if (permissionsRes.error) throw permissionsRes.error;

      setProfiles(profilesRes.data || []);
      setModules(modulesRes.data || []);
      setPermissions(permissionsRes.data || []);
    } catch (error) {
      console.error('Error fetching access profiles:', error);
      toast.error('Erro ao carregar perfis de acesso');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createProfile = async (data: {
    name: string;
    display_name: string;
    description?: string;
    base_role: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const { data: profile, error } = await supabase
        .from('custom_roles')
        .insert({
          name: data.name.toLowerCase().replace(/\s+/g, '_'),
          display_name: data.display_name,
          description: data.description || null,
          base_role: data.base_role,
          created_by: user.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchData();
      toast.success('Perfil criado com sucesso');
      return { success: true, profile };
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Erro ao criar perfil');
      return { success: false };
    }
  };

  const updateProfile = async (id: string, data: Partial<{
    display_name: string;
    description: string;
    base_role: string;
    is_active: boolean;
  }>) => {
    try {
      const { error } = await supabase
        .from('custom_roles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
      toast.success('Perfil atualizado com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erro ao atualizar perfil');
      return { success: false };
    }
  };

  const duplicateProfile = async (profileId: string) => {
    try {
      const source = profiles.find(p => p.id === profileId);
      if (!source) throw new Error('Perfil não encontrado');

      const result = await createProfile({
        name: source.name + '_copy',
        display_name: source.display_name + ' (Cópia)',
        description: source.description || undefined,
        base_role: source.base_role,
      });

      if (!result.success || !result.profile) return { success: false };

      // Copy permissions
      const sourcePerms = permissions.filter(p => p.role_id === profileId);
      if (sourcePerms.length > 0) {
        const newPerms = sourcePerms.map(p => ({
          role_id: result.profile.id,
          module_id: p.module_id,
          can_view: p.can_view,
          can_create: p.can_create,
          can_edit: p.can_edit,
          can_delete: p.can_delete,
        }));

        const { error } = await supabase
          .from('role_module_permissions')
          .insert(newPerms);

        if (error) throw error;
      }

      await fetchData();
      toast.success('Perfil duplicado com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('Error duplicating profile:', error);
      toast.error(error.message || 'Erro ao duplicar perfil');
      return { success: false };
    }
  };

  const archiveProfile = async (id: string) => {
    return updateProfile(id, { is_active: false });
  };

  const updatePermission = async (roleId: string, moduleId: string, perms: {
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
  }) => {
    try {
      // Check if exists
      const existing = permissions.find(p => p.role_id === roleId && p.module_id === moduleId);

      if (existing) {
        const { error } = await supabase
          .from('role_module_permissions')
          .update(perms)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('role_module_permissions')
          .insert({ role_id: roleId, module_id: moduleId, ...perms });
        if (error) throw error;
      }

      await fetchData();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating permission:', error);
      toast.error(error.message || 'Erro ao atualizar permissão');
      return { success: false };
    }
  };

  const getPermissionsForRole = (roleId: string) => {
    return permissions.filter(p => p.role_id === roleId);
  };

  return {
    profiles,
    modules,
    permissions,
    isLoading,
    fetchData,
    createProfile,
    updateProfile,
    duplicateProfile,
    archiveProfile,
    updatePermission,
    getPermissionsForRole,
  };
}
