
-- 1. Tags
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#6366f1',
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read tags" ON public.tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage tags" ON public.tags FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));

-- 2. Candidates
CREATE TABLE public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  linkedin_url text,
  portfolio_url text,
  resume_url text,
  notes text,
  source text,
  availability text,
  is_in_talent_pool boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read candidates" ON public.candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage candidates" ON public.candidates FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));
CREATE POLICY "Anon can insert candidates" ON public.candidates FOR INSERT TO anon WITH CHECK (true);
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Funnels
CREATE TABLE public.funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Funil Padrão',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read funnels" ON public.funnels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage funnels" ON public.funnels FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));
CREATE INDEX idx_funnels_job_id ON public.funnels(job_id);

-- 4. Funnel Stages
CREATE TABLE public.funnel_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  color text DEFAULT '#6366f1',
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.funnel_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read funnel_stages" ON public.funnel_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage funnel_stages" ON public.funnel_stages FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));
CREATE INDEX idx_funnel_stages_funnel_id ON public.funnel_stages(funnel_id);

-- 5. Applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  current_stage_id uuid REFERENCES public.funnel_stages(id),
  status text NOT NULL DEFAULT 'ativa',
  rating integer,
  notes text,
  source text,
  tracking_data jsonb,
  applied_at timestamptz NOT NULL DEFAULT now(),
  rejected_at timestamptz,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read applications" ON public.applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage applications" ON public.applications FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));
CREATE POLICY "Anon can insert applications" ON public.applications FOR INSERT TO anon WITH CHECK (true);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Application Tags
CREATE TABLE public.application_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(application_id, tag_id)
);
ALTER TABLE public.application_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read application_tags" ON public.application_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage application_tags" ON public.application_tags FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));

-- 7. Application History
CREATE TABLE public.application_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  from_stage_id uuid REFERENCES public.funnel_stages(id),
  to_stage_id uuid REFERENCES public.funnel_stages(id),
  action text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.application_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read application_history" ON public.application_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage application_history" ON public.application_history FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));
CREATE INDEX idx_application_history_app ON public.application_history(application_id);

-- 8. Stage Evaluations
CREATE TABLE public.stage_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES public.funnel_stages(id) ON DELETE CASCADE,
  rating integer,
  notes text,
  evaluated_by text,
  evaluated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.stage_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read stage_evaluations" ON public.stage_evaluations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage stage_evaluations" ON public.stage_evaluations FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));

-- 9. Form Responses
CREATE TABLE public.form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  field_id uuid NOT NULL REFERENCES public.form_fields(id) ON DELETE CASCADE,
  value text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read form_responses" ON public.form_responses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage form_responses" ON public.form_responses FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));
CREATE POLICY "Anon can insert form_responses" ON public.form_responses FOR INSERT TO anon WITH CHECK (true);

-- 10. Rejected Applications
CREATE TABLE public.rejected_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  reason_id uuid REFERENCES public.incompatibility_reasons(id),
  observation text,
  can_reapply boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rejected_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read rejected_applications" ON public.rejected_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH can manage rejected_applications" ON public.rejected_applications FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin','rh')) WITH CHECK (public.get_current_user_role() IN ('admin','rh'));

-- 11. Trigger: auto-create funnel when job is created
CREATE OR REPLACE FUNCTION public.create_default_funnel_for_job()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_funnel_id uuid;
BEGIN
  INSERT INTO public.funnels (job_id, name) VALUES (NEW.id, 'Funil Padrão') RETURNING id INTO new_funnel_id;
  INSERT INTO public.funnel_stages (funnel_id, name, order_index, color) VALUES
    (new_funnel_id, 'Inscritos', 0, '#6366f1'),
    (new_funnel_id, 'Triagem RH', 1, '#8b5cf6'),
    (new_funnel_id, 'Entrevista RH', 2, '#a855f7'),
    (new_funnel_id, 'Entrevista Gestor', 3, '#d946ef'),
    (new_funnel_id, 'Teste Técnico', 4, '#ec4899'),
    (new_funnel_id, 'Proposta', 5, '#f43f5e'),
    (new_funnel_id, 'Contratado', 6, '#10b981');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_default_funnel
AFTER INSERT ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.create_default_funnel_for_job();

-- 12. Backfill: create funnels for existing jobs that don't have one
DO $$
DECLARE
  job_record RECORD;
  new_funnel_id uuid;
BEGIN
  FOR job_record IN SELECT id FROM public.jobs WHERE id NOT IN (SELECT job_id FROM public.funnels) LOOP
    INSERT INTO public.funnels (job_id, name) VALUES (job_record.id, 'Funil Padrão') RETURNING id INTO new_funnel_id;
    INSERT INTO public.funnel_stages (funnel_id, name, order_index, color) VALUES
      (new_funnel_id, 'Inscritos', 0, '#6366f1'),
      (new_funnel_id, 'Triagem RH', 1, '#8b5cf6'),
      (new_funnel_id, 'Entrevista RH', 2, '#a855f7'),
      (new_funnel_id, 'Entrevista Gestor', 3, '#d946ef'),
      (new_funnel_id, 'Teste Técnico', 4, '#ec4899'),
      (new_funnel_id, 'Proposta', 5, '#f43f5e'),
      (new_funnel_id, 'Contratado', 6, '#10b981');
  END LOOP;
END;
$$;
