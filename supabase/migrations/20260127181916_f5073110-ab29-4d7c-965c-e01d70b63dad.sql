-- Add tracking_data column to applications table for UTM and referrer tracking
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS tracking_data JSONB DEFAULT NULL;

-- Add comment to document the column
COMMENT ON COLUMN public.applications.tracking_data IS 'JSON object containing UTM parameters, referrer, and landing page for marketing attribution. Structure: { utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, landing_page }';