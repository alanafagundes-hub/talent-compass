
-- Allow anon to read candidates (needed to check existing candidate by email)
CREATE POLICY "Anon can read candidates by email"
ON public.candidates
FOR SELECT
TO anon
USING (true);

-- Allow anon to read funnels (needed to get job funnel for application)
CREATE POLICY "Anon can read funnels"
ON public.funnels
FOR SELECT
TO anon
USING (true);

-- Allow anon to read funnel_stages (needed to get first stage)
CREATE POLICY "Anon can read funnel_stages"
ON public.funnel_stages
FOR SELECT
TO anon
USING (true);

-- Allow anon to insert application_history (needed after application submission)
CREATE POLICY "Anon can insert application_history"
ON public.application_history
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to update candidates (needed to update resume_url for existing candidates)
CREATE POLICY "Anon can update candidates"
ON public.candidates
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
