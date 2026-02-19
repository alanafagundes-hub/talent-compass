
-- Allow authenticated users to insert candidates (public application flow)
CREATE POLICY "Auth can insert candidates"
ON public.candidates
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to read candidates by email (check existing)
CREATE POLICY "Auth can read candidates"
ON public.candidates
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update candidates (refresh resume/data)
CREATE POLICY "Auth can update candidates"
ON public.candidates
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to insert applications
CREATE POLICY "Auth can insert applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert form_responses
CREATE POLICY "Auth can insert form_responses"
ON public.form_responses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert application_history
CREATE POLICY "Auth can insert application_history"
ON public.application_history
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to read funnels (get job funnel)
CREATE POLICY "Auth can read funnels"
ON public.funnels
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to read funnel_stages (get first stage)
CREATE POLICY "Auth can read funnel_stages"
ON public.funnel_stages
FOR SELECT
TO authenticated
USING (true);
