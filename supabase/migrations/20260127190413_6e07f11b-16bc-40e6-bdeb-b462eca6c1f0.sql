-- Storage policies for the resumes bucket
-- Allow public/anonymous uploads to resumes bucket
CREATE POLICY "Allow public upload to resumes"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to read resumes
CREATE POLICY "Allow authenticated read from resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');

-- Allow authenticated users to delete resumes (for cleanup)
CREATE POLICY "Allow authenticated delete from resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');