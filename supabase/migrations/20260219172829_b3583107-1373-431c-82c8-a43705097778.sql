
-- 1. Expandir enum app_role com valores do ATS
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'rh';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'head';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- 2. Função: obter role do usuário ATS (consulta user_roles, NÃO profiles)
CREATE OR REPLACE FUNCTION public.get_ats_user_role(_user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1;
$$;

-- 3. Função: verificar se usuário ATS tem role específica (consulta user_roles)
CREATE OR REPLACE FUNCTION public.ats_has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 4. Função: verificar se usuário ATS é admin
CREATE OR REPLACE FUNCTION public.ats_is_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  );
$$;

-- 5. Função: verificar se usuário ATS está ativo (consulta user_profiles, NÃO profiles)
CREATE OR REPLACE FUNCTION public.ats_is_active_user(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT is_active FROM public.user_profiles WHERE user_id = _user_id LIMIT 1),
    false
  );
$$;

-- 6. Função: verificar permissão de módulo ATS (consulta user_roles + role_module_permissions, sem profiles)
CREATE OR REPLACE FUNCTION public.ats_user_has_module_permission(
  _user_id uuid,
  _module_name text,
  _permission_type text DEFAULT 'view'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  has_perm boolean;
  user_role text;
BEGIN
  -- Admin tem acesso total
  IF public.ats_is_admin(_user_id) THEN
    RETURN true;
  END IF;

  -- Obter role do usuário
  SELECT role::text INTO user_role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
  IF user_role IS NULL THEN
    RETURN false;
  END IF;

  -- Verificar se existe custom_role com esse base_role e permissão no módulo
  SELECT
    CASE
      WHEN _permission_type = 'view' THEN rmp.can_view
      WHEN _permission_type = 'create' THEN rmp.can_create
      WHEN _permission_type = 'edit' THEN rmp.can_edit
      WHEN _permission_type = 'delete' THEN rmp.can_delete
      ELSE false
    END INTO has_perm
  FROM public.role_module_permissions rmp
  JOIN public.modules m ON m.id = rmp.module_id
  JOIN public.custom_roles cr ON cr.id = rmp.role_id
  WHERE m.name = _module_name
    AND cr.base_role::text = user_role
    AND cr.is_active = true
  LIMIT 1;

  RETURN COALESCE(has_perm, false);
END;
$$;

-- 7. Inserir módulos de recrutamento (isolados do CRM)
INSERT INTO public.modules (name, display_name, icon, is_active)
VALUES
  ('ats_dashboard', 'Dashboard', 'LayoutDashboard', true),
  ('ats_vagas', 'Vagas', 'Briefcase', true),
  ('ats_talentos', 'Banco de Talentos', 'Users', true),
  ('ats_perdidos', 'Perdidos', 'UserX', true),
  ('ats_config', 'Config. Recrutamento', 'Settings', true),
  ('ats_admin', 'Configurações Gerais', 'Cog', true)
ON CONFLICT DO NOTHING;
