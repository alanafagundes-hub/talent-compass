-- =============================================
-- SISTEMA ATS DOT - BASE DE DADOS COMPLETA
-- =============================================

-- 1. TIPOS ENUMERADOS
-- =============================================

-- Status de vagas
CREATE TYPE public.job_status AS ENUM ('rascunho', 'publicada', 'pausada', 'encerrada');

-- Níveis de cargo
CREATE TYPE public.job_level AS ENUM ('estagio', 'junior', 'pleno', 'senior', 'especialista', 'coordenador', 'gerente', 'diretor');

-- Tipos de contrato
CREATE TYPE public.contract_type AS ENUM ('clt', 'pj', 'estagio', 'temporario', 'freelancer');

-- Status de candidatura
CREATE TYPE public.application_status AS ENUM ('ativa', 'contratada', 'incompativel', 'desistente');

-- Prioridade de vaga
CREATE TYPE public.job_priority AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- Tipos de campo de formulário
CREATE TYPE public.form_field_type AS ENUM ('short_text', 'long_text', 'multiple_choice', 'yes_no', 'file_upload');

-- Roles de usuário interno
CREATE TYPE public.app_role AS ENUM ('admin', 'rh', 'head', 'viewer');

-- 2. TABELA DE ROLES DE USUÁRIOS
-- =============================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar role (SECURITY DEFINER para evitar recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função para verificar se é usuário interno (qualquer role)
CREATE OR REPLACE FUNCTION public.is_internal_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- RLS para user_roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 3. TABELAS PRINCIPAIS
-- =============================================

-- ÁREAS (departamentos)
CREATE TABLE public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

-- VAGAS
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  level job_level NOT NULL DEFAULT 'pleno',
  contract_type contract_type NOT NULL DEFAULT 'clt',
  location TEXT NOT NULL DEFAULT 'São Paulo, SP',
  is_remote BOOLEAN NOT NULL DEFAULT false,
  salary_min NUMERIC(12,2),
  salary_max NUMERIC(12,2),
  status job_status NOT NULL DEFAULT 'rascunho',
  priority job_priority NOT NULL DEFAULT 'media',
  slug TEXT UNIQUE,
  deadline DATE,
  form_template_id UUID,
  is_boosted BOOLEAN DEFAULT false,
  investment_amount NUMERIC(12,2) DEFAULT 0,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Gerar slug automaticamente
CREATE OR REPLACE FUNCTION public.generate_job_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_job_slug
  BEFORE INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_job_slug();

-- FUNIS (configuração por vaga)
CREATE TABLE public.funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Funil Padrão',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- ETAPAS DO FUNIL
CREATE TABLE public.funnel_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#6366f1',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_stages ENABLE ROW LEVEL SECURITY;

-- CANDIDATOS (pessoas físicas únicas por email)
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  notes TEXT,
  source TEXT,
  is_in_talent_pool BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- CANDIDATURAS (ligação candidato + vaga)
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  current_stage_id UUID REFERENCES public.funnel_stages(id) ON DELETE SET NULL,
  status application_status NOT NULL DEFAULT 'ativa',
  source TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  hired_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (candidate_id, job_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ETIQUETAS
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6366f1',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- CANDIDATURA_ETIQUETAS (many-to-many)
CREATE TABLE public.application_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (application_id, tag_id)
);

ALTER TABLE public.application_tags ENABLE ROW LEVEL SECURITY;

-- AVALIAÇÕES POR ETAPA
CREATE TABLE public.stage_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  stage_id UUID REFERENCES public.funnel_stages(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  evaluated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stage_evaluations ENABLE ROW LEVEL SECURITY;

-- HISTÓRICO DE MOVIMENTAÇÕES
CREATE TABLE public.application_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  from_stage_id UUID REFERENCES public.funnel_stages(id) ON DELETE SET NULL,
  to_stage_id UUID REFERENCES public.funnel_stages(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'applied', 'moved', 'hired', 'rejected', 'note_added'
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.application_history ENABLE ROW LEVEL SECURITY;

-- MOTIVOS DE INCOMPATIBILIDADE
CREATE TABLE public.rejection_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rejection_reasons ENABLE ROW LEVEL SECURITY;

-- CANDIDATURAS PERDIDAS/REJEITADAS
CREATE TABLE public.rejected_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL UNIQUE,
  reason_id UUID REFERENCES public.rejection_reasons(id) ON DELETE SET NULL,
  observation TEXT,
  can_reapply BOOLEAN NOT NULL DEFAULT true,
  reapply_after DATE,
  rejected_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rejected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rejected_applications ENABLE ROW LEVEL SECURITY;

-- FONTES DE CANDIDATOS
CREATE TABLE public.candidate_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_sources ENABLE ROW LEVEL SECURITY;

-- TEMPLATES DE FORMULÁRIO
CREATE TABLE public.form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;

-- PERGUNTAS DO FORMULÁRIO
CREATE TABLE public.form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.form_templates(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  field_type form_field_type NOT NULL DEFAULT 'short_text',
  is_required BOOLEAN NOT NULL DEFAULT false,
  options JSONB, -- para multiple_choice
  placeholder TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;

-- RESPOSTAS DO FORMULÁRIO
CREATE TABLE public.form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES public.form_fields(id) ON DELETE CASCADE NOT NULL,
  value TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

-- CONFIGURAÇÃO DA LANDING PAGE
CREATE TABLE public.landing_page_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Empresa',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#6366f1',
  hero_title TEXT,
  hero_subtitle TEXT,
  about_text TEXT,
  benefits JSONB,
  social_links JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_page_config ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS RLS
-- =============================================

-- ÁREAS
CREATE POLICY "Internal users can manage areas"
  ON public.areas FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can read non-archived areas"
  ON public.areas FOR SELECT TO anon
  USING (is_archived = false);

-- VAGAS
CREATE POLICY "Internal users can manage jobs"
  ON public.jobs FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can read published jobs"
  ON public.jobs FOR SELECT TO anon
  USING (status = 'publicada' AND is_archived = false);

-- FUNIS
CREATE POLICY "Internal users can manage funnels"
  ON public.funnels FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- ETAPAS DO FUNIL
CREATE POLICY "Internal users can manage funnel stages"
  ON public.funnel_stages FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- CANDIDATOS
CREATE POLICY "Internal users can manage candidates"
  ON public.candidates FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can insert candidates"
  ON public.candidates FOR INSERT TO anon
  WITH CHECK (true);

-- CANDIDATURAS
CREATE POLICY "Internal users can manage applications"
  ON public.applications FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can insert applications"
  ON public.applications FOR INSERT TO anon
  WITH CHECK (true);

-- ETIQUETAS
CREATE POLICY "Internal users can manage tags"
  ON public.tags FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- APPLICATION_TAGS
CREATE POLICY "Internal users can manage application tags"
  ON public.application_tags FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- AVALIAÇÕES
CREATE POLICY "Internal users can manage evaluations"
  ON public.stage_evaluations FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- HISTÓRICO
CREATE POLICY "Internal users can manage history"
  ON public.application_history FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- MOTIVOS DE REJEIÇÃO
CREATE POLICY "Internal users can manage rejection reasons"
  ON public.rejection_reasons FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- CANDIDATURAS REJEITADAS
CREATE POLICY "Internal users can manage rejected applications"
  ON public.rejected_applications FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

-- FONTES DE CANDIDATOS
CREATE POLICY "Internal users can manage sources"
  ON public.candidate_sources FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can read sources"
  ON public.candidate_sources FOR SELECT TO anon
  USING (is_archived = false);

-- TEMPLATES DE FORMULÁRIO
CREATE POLICY "Internal users can manage form templates"
  ON public.form_templates FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can read form templates"
  ON public.form_templates FOR SELECT TO anon
  USING (is_archived = false);

-- CAMPOS DO FORMULÁRIO
CREATE POLICY "Internal users can manage form fields"
  ON public.form_fields FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can read form fields"
  ON public.form_fields FOR SELECT TO anon
  USING (true);

-- RESPOSTAS DO FORMULÁRIO
CREATE POLICY "Internal users can manage form responses"
  ON public.form_responses FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can insert form responses"
  ON public.form_responses FOR INSERT TO anon
  WITH CHECK (true);

-- CONFIG DA LANDING PAGE
CREATE POLICY "Internal users can manage landing config"
  ON public.landing_page_config FOR ALL TO authenticated
  USING (public.is_internal_user(auth.uid()))
  WITH CHECK (public.is_internal_user(auth.uid()));

CREATE POLICY "Public can read landing config"
  ON public.landing_page_config FOR SELECT TO anon
  USING (is_active = true);

-- 5. FUNÇÕES DE ATUALIZAÇÃO DE TIMESTAMP
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER update_areas_updated_at
  BEFORE UPDATE ON public.areas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_form_templates_updated_at
  BEFORE UPDATE ON public.form_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_landing_config_updated_at
  BEFORE UPDATE ON public.landing_page_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. FUNÇÃO PARA CRIAR FUNIL PADRÃO
-- =============================================

CREATE OR REPLACE FUNCTION public.create_default_funnel()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_default_funnel
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_funnel();

-- 7. STORAGE BUCKET PARA CURRÍCULOS
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Políticas de storage
CREATE POLICY "Internal users can read resumes"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND public.is_internal_user(auth.uid()));

CREATE POLICY "Internal users can upload resumes"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND public.is_internal_user(auth.uid()));

CREATE POLICY "Public can upload resumes"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Internal users can delete resumes"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND public.is_internal_user(auth.uid()));

-- 8. DADOS INICIAIS
-- =============================================

-- Motivos de incompatibilidade padrão
INSERT INTO public.rejection_reasons (name, description) VALUES
  ('Salário', 'Expectativa salarial incompatível'),
  ('Perfil Inadequado', 'Perfil técnico ou comportamental não adequado'),
  ('Desistência', 'Candidato desistiu do processo'),
  ('Outra Proposta', 'Candidato aceitou outra proposta'),
  ('Sem Retorno', 'Candidato não respondeu às tentativas de contato'),
  ('Reprovado Teste', 'Não atingiu pontuação mínima no teste técnico'),
  ('Reprovado Entrevista', 'Não aprovado em entrevista'),
  ('Outros', 'Outros motivos');

-- Fontes de candidatos padrão
INSERT INTO public.candidate_sources (name, icon) VALUES
  ('LinkedIn', 'linkedin'),
  ('Indeed', 'briefcase'),
  ('Indicação', 'users'),
  ('Site da Empresa', 'globe'),
  ('Gupy', 'briefcase'),
  ('Outros', 'more-horizontal');

-- Config inicial da landing page
INSERT INTO public.landing_page_config (company_name, primary_color, hero_title, hero_subtitle)
VALUES (
  'Sua Empresa',
  '#6366f1',
  'Faça parte do nosso time!',
  'Encontre a oportunidade perfeita para sua carreira.'
);

-- 9. ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_area_id ON public.jobs(area_id);
CREATE INDEX idx_jobs_slug ON public.jobs(slug);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_funnel_stages_funnel_id ON public.funnel_stages(funnel_id);
CREATE INDEX idx_application_history_application_id ON public.application_history(application_id);