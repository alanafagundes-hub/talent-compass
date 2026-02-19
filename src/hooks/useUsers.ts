import { useState, useEffect, useCallback } from 'react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
const supabase = supabaseClient as any;
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'rh' | 'head' | 'viewer';
  created_at: string;
}

export interface UserAreaAssignment {
  id: string;
  user_id: string;
  area_id: string;
  created_at: string;
  area?: {
    id: string;
    name: string;
  };
}

export interface UserWithDetails {
  profile: UserProfile;
  role: UserRole | null;
  areas: UserAreaAssignment[];
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('name');

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Fetch area assignments with area names
      const { data: areaAssignments, error: areasError } = await supabase
        .from('user_area_assignments')
        .select(`
          *,
          area:areas(id, name)
        `);

      if (areasError) throw areasError;

      // Combine data
      const usersWithDetails: UserWithDetails[] = (profiles || []).map(profile => ({
        profile,
        role: roles?.find(r => r.user_id === profile.user_id) || null,
        areas: (areaAssignments || [])
          .filter(a => a.user_id === profile.user_id)
          .map(a => ({
            ...a,
            area: a.area as { id: string; name: string } | undefined
          })),
      }));

      setUsers(usersWithDetails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (data: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'rh' | 'head' | 'viewer';
    areaIds?: string[];
  }) => {
    try {
      // Create auth user via Supabase Admin API (requires admin access)
      // For now, we'll use the signUp method which the user can then confirm
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: data.name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Usuário não criado');

      const userId = authData.user.id;

      // Create profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          name: data.name,
          email: data.email,
          is_active: true,
        });

      if (profileError) throw profileError;

      // Create role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: data.role,
        });

      if (roleError) throw roleError;

      // Create area assignments if provided
      if (data.areaIds && data.areaIds.length > 0) {
        const areaAssignments = data.areaIds.map(areaId => ({
          user_id: userId,
          area_id: areaId,
        }));

        const { error: areasError } = await supabase
          .from('user_area_assignments')
          .insert(areaAssignments);

        if (areasError) throw areasError;
      }

      await fetchUsers();
      toast.success('Usuário criado com sucesso! Um e-mail de confirmação foi enviado.');
      return { success: true };
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erro ao criar usuário');
      return { success: false, error };
    }
  };

  const updateUser = async (userId: string, data: {
    name?: string;
    is_active?: boolean;
    role?: 'admin' | 'rh' | 'head' | 'viewer';
    areaIds?: string[];
  }) => {
    try {
      // Update profile
      if (data.name !== undefined || data.is_active !== undefined) {
        const updates: Partial<UserProfile> = {};
        if (data.name !== undefined) updates.name = data.name;
        if (data.is_active !== undefined) updates.is_active = data.is_active;

        const { error: profileError } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('user_id', userId);

        if (profileError) throw profileError;
      }

      // Update role
      if (data.role !== undefined) {
        // Check if role exists
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingRole) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: data.role })
            .eq('user_id', userId);

          if (roleError) throw roleError;
        } else {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: data.role });

          if (roleError) throw roleError;
        }
      }

      // Update area assignments
      if (data.areaIds !== undefined) {
        // Delete existing assignments
        const { error: deleteError } = await supabase
          .from('user_area_assignments')
          .delete()
          .eq('user_id', userId);

        if (deleteError) throw deleteError;

        // Insert new assignments
        if (data.areaIds.length > 0) {
          const areaAssignments = data.areaIds.map(areaId => ({
            user_id: userId,
            area_id: areaId,
          }));

          const { error: areasError } = await supabase
            .from('user_area_assignments')
            .insert(areaAssignments);

          if (areasError) throw areasError;
        }
      }

      await fetchUsers();
      toast.success('Usuário atualizado com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Erro ao atualizar usuário');
      return { success: false, error };
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    return updateUser(userId, { is_active: !currentStatus });
  };

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
  };
}
