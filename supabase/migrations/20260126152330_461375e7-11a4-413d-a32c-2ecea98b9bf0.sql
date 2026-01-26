-- ============================================
-- 1. CRIAR TABELA DE PERFIS DE USUÁRIO
-- ============================================
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Trigger para updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. CRIAR TABELA DE ASSOCIAÇÃO USUÁRIO-ÁREA
-- ============================================
CREATE TABLE public.user_area_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, area_id)
);

-- Enable RLS
ALTER TABLE public.user_area_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CRIAR FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar se usuário está ativo
CREATE OR REPLACE FUNCTION public.is_user_active(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_active FROM public.user_profiles WHERE user_id = _user_id),
    true
  )
$$;

-- Função para verificar se usuário tem acesso a uma área específica
CREATE OR REPLACE FUNCTION public.has_area_access(_user_id UUID, _area_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- Admin e RH têm acesso a todas as áreas
    public.has_role(_user_id, 'admin') 
    OR public.has_role(_user_id, 'rh')
    -- Head só tem acesso às áreas atribuídas
    OR EXISTS (
      SELECT 1 FROM public.user_area_assignments
      WHERE user_id = _user_id AND area_id = _area_id
    )
$$;

-- Função para obter IDs das áreas que o usuário tem acesso
CREATE OR REPLACE FUNCTION public.get_user_areas(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'rh') THEN
      (SELECT id FROM public.areas WHERE is_archived = false)
    ELSE
      (SELECT area_id FROM public.user_area_assignments WHERE user_id = _user_id)
  END
$$;

-- Função para verificar se usuário pode gerenciar usuários (apenas admin)
CREATE OR REPLACE FUNCTION public.can_manage_users(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- ============================================
-- 4. POLÍTICAS RLS PARA user_profiles
-- ============================================

-- Admins podem gerenciar todos os perfis
CREATE POLICY "Admins can manage all profiles"
ON public.user_profiles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Usuários internos podem visualizar perfis
CREATE POLICY "Internal users can view profiles"
ON public.user_profiles
FOR SELECT
USING (public.is_internal_user(auth.uid()));

-- Usuários podem atualizar seu próprio perfil (exceto is_active)
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 5. POLÍTICAS RLS PARA user_area_assignments
-- ============================================

-- Apenas admins podem gerenciar atribuições de área
CREATE POLICY "Admins can manage area assignments"
ON public.user_area_assignments
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Usuários internos podem visualizar atribuições
CREATE POLICY "Internal users can view area assignments"
ON public.user_area_assignments
FOR SELECT
USING (public.is_internal_user(auth.uid()));

-- ============================================
-- 6. CRIAR PERFIL PARA USUÁRIO ADMIN EXISTENTE
-- ============================================

-- Inserir perfil para o usuário admin existente
INSERT INTO public.user_profiles (user_id, name, email)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.email
FROM auth.users u
INNER JOIN public.user_roles ur ON ur.user_id = u.id
ON CONFLICT (user_id) DO NOTHING;