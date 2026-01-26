-- ============================================
-- ATUALIZAR POLÍTICAS RLS PARA CONTROLE POR ÁREA
-- ============================================

-- 1. Atualizar is_internal_user para verificar status ativo
CREATE OR REPLACE FUNCTION public.is_internal_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    LEFT JOIN public.user_profiles up ON up.user_id = ur.user_id
    WHERE ur.user_id = _user_id
    AND COALESCE(up.is_active, true) = true
  )
$$;

-- ============================================
-- 2. JOBS - Adicionar controle por área para Head
-- ============================================

-- Remover política antiga
DROP POLICY IF EXISTS "Internal users can manage jobs" ON public.jobs;

-- Admin e RH podem ver todas as vagas
CREATE POLICY "Admin and RH can manage all jobs"
ON public.jobs
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
);

-- Head pode apenas visualizar vagas da sua área
CREATE POLICY "Head can view jobs in their areas"
ON public.jobs
FOR SELECT
USING (
  public.has_role(auth.uid(), 'head')
  AND public.has_area_access(auth.uid(), area_id)
);

-- ============================================
-- 3. APPLICATIONS - Controle por área
-- ============================================

-- Remover política antiga
DROP POLICY IF EXISTS "Internal users can manage applications" ON public.applications;

-- Admin e RH podem gerenciar todas as candidaturas
CREATE POLICY "Admin and RH can manage all applications"
ON public.applications
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
);

-- Head pode visualizar candidaturas de vagas da sua área
CREATE POLICY "Head can view applications in their areas"
ON public.applications
FOR SELECT
USING (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.jobs j 
    WHERE j.id = job_id 
    AND public.has_area_access(auth.uid(), j.area_id)
  )
);

-- Head pode atualizar (avaliar) candidaturas de vagas da sua área
CREATE POLICY "Head can update applications in their areas"
ON public.applications
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.jobs j 
    WHERE j.id = job_id 
    AND public.has_area_access(auth.uid(), j.area_id)
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.jobs j 
    WHERE j.id = job_id 
    AND public.has_area_access(auth.uid(), j.area_id)
  )
);

-- ============================================
-- 4. CANDIDATES - Heads podem ver candidatos da área
-- ============================================

-- Remover política antiga
DROP POLICY IF EXISTS "Internal users can manage candidates" ON public.candidates;

-- Admin e RH podem gerenciar todos os candidatos
CREATE POLICY "Admin and RH can manage all candidates"
ON public.candidates
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
);

-- Head pode visualizar candidatos que aplicaram em vagas da sua área
CREATE POLICY "Head can view candidates in their areas"
ON public.candidates
FOR SELECT
USING (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.applications a
    INNER JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id = candidates.id
    AND public.has_area_access(auth.uid(), j.area_id)
  )
);

-- ============================================
-- 5. STAGE_EVALUATIONS - Head pode avaliar
-- ============================================

-- Remover política antiga
DROP POLICY IF EXISTS "Internal users can manage evaluations" ON public.stage_evaluations;

-- Admin e RH podem gerenciar todas as avaliações
CREATE POLICY "Admin and RH can manage all evaluations"
ON public.stage_evaluations
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
);

-- Head pode gerenciar avaliações de candidaturas da sua área
CREATE POLICY "Head can manage evaluations in their areas"
ON public.stage_evaluations
FOR ALL
USING (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.applications a
    INNER JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = application_id
    AND public.has_area_access(auth.uid(), j.area_id)
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.applications a
    INNER JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = application_id
    AND public.has_area_access(auth.uid(), j.area_id)
  )
);

-- ============================================
-- 6. APPLICATION_HISTORY - Head pode ver histórico
-- ============================================

DROP POLICY IF EXISTS "Internal users can manage history" ON public.application_history;

-- Admin e RH podem gerenciar todo o histórico
CREATE POLICY "Admin and RH can manage all history"
ON public.application_history
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'rh')
);

-- Head pode visualizar e inserir histórico para candidaturas da sua área
CREATE POLICY "Head can view and add history in their areas"
ON public.application_history
FOR SELECT
USING (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.applications a
    INNER JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = application_id
    AND public.has_area_access(auth.uid(), j.area_id)
  )
);

CREATE POLICY "Head can insert history in their areas"
ON public.application_history
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'head')
  AND EXISTS (
    SELECT 1 FROM public.applications a
    INNER JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = application_id
    AND public.has_area_access(auth.uid(), j.area_id)
  )
);

-- ============================================
-- 7. Viewer role - apenas visualização limitada
-- ============================================

-- Adicionar política para viewers (se necessário no futuro)
-- Por enquanto, viewers não têm acesso via RLS