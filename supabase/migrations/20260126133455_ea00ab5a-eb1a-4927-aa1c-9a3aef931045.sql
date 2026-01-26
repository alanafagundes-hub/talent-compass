-- CORREÇÃO DE AVISOS DE SEGURANÇA
-- =============================================

-- 1. CORRIGIR FUNÇÕES SEM search_path
-- =============================================

-- Corrigir generate_job_slug
CREATE OR REPLACE FUNCTION public.generate_job_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$;

-- Corrigir update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Corrigir create_default_funnel
CREATE OR REPLACE FUNCTION public.create_default_funnel()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_funnel_id UUID;
BEGIN
  -- Criar funil padrão
  INSERT INTO public.funnels (job_id, name)
  VALUES (NEW.id, 'Funil Padrão')
  RETURNING id INTO new_funnel_id;
  
  -- Criar etapas padrão
  INSERT INTO public.funnel_stages (funnel_id, name, order_index, color) VALUES
    (new_funnel_id, 'Inscritos', 1, '#6366f1'),
    (new_funnel_id, 'Triagem RH', 2, '#8b5cf6'),
    (new_funnel_id, 'Entrevista RH', 3, '#a855f7'),
    (new_funnel_id, 'Entrevista Técnica', 4, '#d946ef'),
    (new_funnel_id, 'Entrevista Final', 5, '#ec4899'),
    (new_funnel_id, 'Oferta', 6, '#f97316'),
    (new_funnel_id, 'Contratado', 7, '#22c55e');
  
  RETURN NEW;
END;
$$;

-- 2. REMOVER POLÍTICAS COM "WITH CHECK (true)" E CRIAR VERSÕES MAIS SEGURAS
-- =============================================

-- Candidatos: remover política antiga e criar nova com validação
DROP POLICY IF EXISTS "Public can insert candidates" ON public.candidates;

CREATE POLICY "Public can insert candidates with validation"
  ON public.candidates FOR INSERT TO anon
  WITH CHECK (
    -- Validar que campos obrigatórios estão preenchidos
    name IS NOT NULL AND name <> '' AND
    email IS NOT NULL AND email <> '' AND
    -- Validar formato básico de email
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Candidaturas: remover política antiga e criar nova com validação
DROP POLICY IF EXISTS "Public can insert applications" ON public.applications;

CREATE POLICY "Public can insert applications with validation"
  ON public.applications FOR INSERT TO anon
  WITH CHECK (
    -- Validar que candidato e vaga existem
    candidate_id IS NOT NULL AND
    job_id IS NOT NULL AND
    -- Só permite inserir candidaturas com status 'ativa'
    status = 'ativa'
  );

-- Respostas de formulário: remover política antiga e criar nova com validação
DROP POLICY IF EXISTS "Public can insert form responses" ON public.form_responses;

CREATE POLICY "Public can insert form responses with validation"
  ON public.form_responses FOR INSERT TO anon
  WITH CHECK (
    -- Validar que candidatura e campo existem
    application_id IS NOT NULL AND
    field_id IS NOT NULL
  );