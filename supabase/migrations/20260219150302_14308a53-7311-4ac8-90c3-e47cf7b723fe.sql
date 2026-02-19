
-- Tabela incompatibility_reasons
CREATE TABLE IF NOT EXISTS public.incompatibility_reasons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela email_templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'custom',
  subject text NOT NULL,
  body text NOT NULL,
  is_default boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela candidate_sources
CREATE TABLE IF NOT EXISTS public.candidate_sources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon text DEFAULT 'link',
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.incompatibility_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_sources ENABLE ROW LEVEL SECURITY;

-- Policies: incompatibility_reasons
CREATE POLICY "Authenticated read incompatibility_reasons" ON public.incompatibility_reasons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH insert incompatibility_reasons" ON public.incompatibility_reasons FOR INSERT TO authenticated WITH CHECK (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH update incompatibility_reasons" ON public.incompatibility_reasons FOR UPDATE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH delete incompatibility_reasons" ON public.incompatibility_reasons FOR DELETE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));

-- Policies: email_templates
CREATE POLICY "Authenticated read email_templates" ON public.email_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH insert email_templates" ON public.email_templates FOR INSERT TO authenticated WITH CHECK (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH update email_templates" ON public.email_templates FOR UPDATE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH delete email_templates" ON public.email_templates FOR DELETE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));

-- Policies: candidate_sources
CREATE POLICY "Authenticated read candidate_sources" ON public.candidate_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH insert candidate_sources" ON public.candidate_sources FOR INSERT TO authenticated WITH CHECK (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH update candidate_sources" ON public.candidate_sources FOR UPDATE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH delete candidate_sources" ON public.candidate_sources FOR DELETE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));

-- Triggers updated_at
CREATE TRIGGER update_incompatibility_reasons_updated_at BEFORE UPDATE ON public.incompatibility_reasons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidate_sources_updated_at BEFORE UPDATE ON public.candidate_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
