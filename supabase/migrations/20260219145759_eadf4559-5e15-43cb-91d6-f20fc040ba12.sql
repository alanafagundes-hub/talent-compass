
-- Tabela areas
CREATE TABLE IF NOT EXISTS public.areas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT areas_name_unique UNIQUE (name)
);

-- Tabela jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  requirements text,
  level text NOT NULL DEFAULT 'pleno',
  contract_type text NOT NULL DEFAULT 'clt',
  work_model text DEFAULT 'presencial',
  location text NOT NULL DEFAULT 'Brasil',
  about_job text,
  about_company text,
  responsibilities text,
  requirements_text text,
  nice_to_have text,
  additional_info text,
  salary_min numeric,
  salary_max numeric,
  status text NOT NULL DEFAULT 'rascunho',
  priority text NOT NULL DEFAULT 'media',
  area_id uuid REFERENCES public.areas(id),
  form_template_id uuid,
  source_id text,
  deadline date,
  is_remote boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  is_boosted boolean DEFAULT false,
  investment_amount numeric DEFAULT 0,
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela form_templates
CREATE TABLE IF NOT EXISTS public.form_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela form_fields
CREATE TABLE IF NOT EXISTS public.form_fields (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  label text NOT NULL,
  field_type text NOT NULL,
  is_required boolean DEFAULT false,
  order_index integer DEFAULT 0,
  placeholder text,
  options text[],
  created_at timestamptz DEFAULT now()
);

-- Tabela user_roles (usando app_role existente)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Tabela user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies: areas
CREATE POLICY "Authenticated read areas" ON public.areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH manage areas insert" ON public.areas FOR INSERT TO authenticated WITH CHECK (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage areas update" ON public.areas FOR UPDATE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage areas delete" ON public.areas FOR DELETE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));

-- Policies: jobs
CREATE POLICY "Authenticated read jobs" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH manage jobs insert" ON public.jobs FOR INSERT TO authenticated WITH CHECK (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage jobs update" ON public.jobs FOR UPDATE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage jobs delete" ON public.jobs FOR DELETE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Public read published jobs" ON public.jobs FOR SELECT TO anon USING (status = 'publicada' AND is_archived = false);

-- Policies: form_templates
CREATE POLICY "Authenticated read form_templates" ON public.form_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH manage form_templates insert" ON public.form_templates FOR INSERT TO authenticated WITH CHECK (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage form_templates update" ON public.form_templates FOR UPDATE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage form_templates delete" ON public.form_templates FOR DELETE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));

-- Policies: form_fields
CREATE POLICY "Authenticated read form_fields" ON public.form_fields FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/RH manage form_fields insert" ON public.form_fields FOR INSERT TO authenticated WITH CHECK (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage form_fields update" ON public.form_fields FOR UPDATE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));
CREATE POLICY "Admin/RH manage form_fields delete" ON public.form_fields FOR DELETE TO authenticated USING (get_current_user_role() IN ('admin', 'rh'));

-- Policies: user_roles
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin manage roles" ON public.user_roles FOR ALL TO authenticated USING (get_current_user_role() = 'admin');

-- Policies: user_profiles
CREATE POLICY "Users read own profile" ON public.user_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin manage user_profiles" ON public.user_profiles FOR ALL TO authenticated USING (get_current_user_role() = 'admin');

-- Triggers updated_at
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_templates_updated_at BEFORE UPDATE ON public.form_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
