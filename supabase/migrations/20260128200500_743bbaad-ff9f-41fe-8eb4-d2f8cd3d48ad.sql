-- Add availability field to candidates table
-- Possible values: 'actively_seeking', 'open_to_opportunities', 'not_interested'
ALTER TABLE public.candidates 
ADD COLUMN availability text DEFAULT 'open_to_opportunities';

-- Add constraint to ensure valid values
ALTER TABLE public.candidates 
ADD CONSTRAINT candidates_availability_check 
CHECK (availability IN ('actively_seeking', 'open_to_opportunities', 'not_interested'));

-- Add index for filtering
CREATE INDEX idx_candidates_availability ON public.candidates(availability);

-- Add comment for documentation
COMMENT ON COLUMN public.candidates.availability IS 'Candidate availability status: actively_seeking, open_to_opportunities, not_interested';