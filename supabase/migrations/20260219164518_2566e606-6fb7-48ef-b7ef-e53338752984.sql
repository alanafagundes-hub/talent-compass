
-- Allow anonymous users to read form_templates (needed for public job pages)
CREATE POLICY "Anon can read form_templates"
ON public.form_templates
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to read form_fields (needed for public job pages)
CREATE POLICY "Anon can read form_fields"
ON public.form_fields
FOR SELECT
TO anon
USING (true);
