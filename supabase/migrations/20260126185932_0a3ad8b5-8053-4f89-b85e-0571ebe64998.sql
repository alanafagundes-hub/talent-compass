-- Create work_model enum type
CREATE TYPE public.work_model AS ENUM ('remoto', 'presencial', 'hibrido');

-- Add new editorial fields and work_model to jobs table
ALTER TABLE public.jobs
ADD COLUMN about_job TEXT,
ADD COLUMN about_company TEXT,
ADD COLUMN responsibilities TEXT,
ADD COLUMN requirements_text TEXT,
ADD COLUMN nice_to_have TEXT,
ADD COLUMN additional_info TEXT,
ADD COLUMN work_model public.work_model NOT NULL DEFAULT 'presencial';

-- Migrate existing data: convert is_remote boolean to work_model
UPDATE public.jobs 
SET work_model = CASE 
  WHEN is_remote = true THEN 'remoto'::work_model 
  ELSE 'presencial'::work_model 
END;

-- Migrate existing description/requirements to new fields
UPDATE public.jobs 
SET about_job = description,
    requirements_text = requirements
WHERE about_job IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.jobs.work_model IS 'Modelo de trabalho: remoto, presencial ou híbrido';
COMMENT ON COLUMN public.jobs.about_job IS 'Descrição sobre a vaga';
COMMENT ON COLUMN public.jobs.about_company IS 'Descrição sobre a empresa (DOT)';
COMMENT ON COLUMN public.jobs.responsibilities IS 'Responsabilidades da função';
COMMENT ON COLUMN public.jobs.requirements_text IS 'Pré-requisitos obrigatórios';
COMMENT ON COLUMN public.jobs.nice_to_have IS 'Diferenciais desejáveis';
COMMENT ON COLUMN public.jobs.additional_info IS 'Informações adicionais';