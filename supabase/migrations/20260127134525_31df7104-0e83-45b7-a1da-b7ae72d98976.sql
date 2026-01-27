-- Create storage bucket for landing page logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-logos', 'landing-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated internal users to upload logos
CREATE POLICY "Internal users can upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'landing-logos' 
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'rh')
  )
);

-- Allow authenticated internal users to update logos
CREATE POLICY "Internal users can update logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'landing-logos' 
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'rh')
  )
)
WITH CHECK (
  bucket_id = 'landing-logos' 
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'rh')
  )
);

-- Allow authenticated internal users to delete logos
CREATE POLICY "Internal users can delete logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'landing-logos' 
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'rh')
  )
);

-- Allow public read access for logos (public bucket)
CREATE POLICY "Public can view logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'landing-logos');