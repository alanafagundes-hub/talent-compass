import { useState, useEffect, useCallback } from 'react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import type { Job, JobStatus, WorkModel } from '@/types/ats';

// Cast to any to bypass type errors for tables not yet in types.ts
const supabase = supabaseClient as any;

type DbJob = any;

// Map database job to application Job type
const mapDbJobToJob = (dbJob: DbJob): Job => ({
  id: dbJob.id,
  title: dbJob.title,
  description: dbJob.description,
  requirements: dbJob.requirements || undefined,
  level: dbJob.level,
  contractType: dbJob.contract_type,
  workModel: (dbJob as any).work_model || 'presencial',
  location: dbJob.location,
  // Editorial fields
  aboutJob: (dbJob as any).about_job || undefined,
  aboutCompany: (dbJob as any).about_company || undefined,
  responsibilities: (dbJob as any).responsibilities || undefined,
  requirementsText: (dbJob as any).requirements_text || undefined,
  niceToHave: (dbJob as any).nice_to_have || undefined,
  additionalInfo: (dbJob as any).additional_info || undefined,
  salary: dbJob.salary_min || dbJob.salary_max 
    ? { min: Number(dbJob.salary_min) || 0, max: Number(dbJob.salary_max) || 0 }
    : undefined,
  status: dbJob.status,
  priority: dbJob.priority,
  areaId: dbJob.area_id || '',
  formTemplateId: dbJob.form_template_id || undefined,
  deadline: dbJob.deadline ? new Date(dbJob.deadline) : undefined,
  isArchived: dbJob.is_archived,
  createdAt: new Date(dbJob.created_at),
  updatedAt: new Date(dbJob.updated_at),
  isBoosted: dbJob.is_boosted || false,
  investmentAmount: dbJob.investment_amount ? Number(dbJob.investment_amount) : undefined,
});

// Map application Job to database insert format
const mapJobToDbInsert = (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): any => {
  const base: any = {
    title: job.title,
    description: job.description,
    requirements: job.requirements || null,
    level: job.level,
    contract_type: job.contractType,
    location: job.location,
    is_remote: job.workModel === 'remoto', // Legacy field
    salary_min: job.salary?.min || null,
    salary_max: job.salary?.max || null,
    status: job.status,
    priority: job.priority,
    area_id: job.areaId || null,
    form_template_id: job.formTemplateId || null,
    deadline: job.deadline ? job.deadline.toISOString().split('T')[0] : null,
    is_archived: job.isArchived,
    is_boosted: job.isBoosted || false,
    investment_amount: job.investmentAmount || 0,
  };
  
  // Add new fields using spread (since types haven't been regenerated yet)
  return {
    ...base,
    work_model: job.workModel,
    about_job: job.aboutJob || null,
    about_company: job.aboutCompany || null,
    responsibilities: job.responsibilities || null,
    requirements_text: job.requirementsText || null,
    nice_to_have: job.niceToHave || null,
    additional_info: job.additionalInfo || null,
  } as any;
};

// Map application Job updates to database update format
const mapJobToDbUpdate = (updates: Partial<Job>): any => {
  const dbUpdates: Record<string, any> = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.requirements !== undefined) dbUpdates.requirements = updates.requirements || null;
  if (updates.level !== undefined) dbUpdates.level = updates.level;
  if (updates.contractType !== undefined) dbUpdates.contract_type = updates.contractType;
  if (updates.workModel !== undefined) {
    dbUpdates.work_model = updates.workModel;
    dbUpdates.is_remote = updates.workModel === 'remoto';
  }
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  // Editorial fields
  if (updates.aboutJob !== undefined) dbUpdates.about_job = updates.aboutJob || null;
  if (updates.aboutCompany !== undefined) dbUpdates.about_company = updates.aboutCompany || null;
  if (updates.responsibilities !== undefined) dbUpdates.responsibilities = updates.responsibilities || null;
  if (updates.requirementsText !== undefined) dbUpdates.requirements_text = updates.requirementsText || null;
  if (updates.niceToHave !== undefined) dbUpdates.nice_to_have = updates.niceToHave || null;
  if (updates.additionalInfo !== undefined) dbUpdates.additional_info = updates.additionalInfo || null;
  if (updates.salary !== undefined) {
    dbUpdates.salary_min = updates.salary?.min || null;
    dbUpdates.salary_max = updates.salary?.max || null;
  }
  if (updates.status !== undefined) {
    dbUpdates.status = updates.status;
    if (updates.status === 'publicada') {
      dbUpdates.published_at = new Date().toISOString();
    }
    if (updates.status === 'encerrada') {
      dbUpdates.closed_at = new Date().toISOString();
    }
  }
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.areaId !== undefined) dbUpdates.area_id = updates.areaId || null;
  if (updates.formTemplateId !== undefined) dbUpdates.form_template_id = updates.formTemplateId || null;
  if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline ? updates.deadline.toISOString().split('T')[0] : null;
  if (updates.isArchived !== undefined) dbUpdates.is_archived = updates.isArchived;
  if (updates.isBoosted !== undefined) dbUpdates.is_boosted = updates.isBoosted;
  if (updates.investmentAmount !== undefined) dbUpdates.investment_amount = updates.investmentAmount || 0;
  
  return dbUpdates as any;
};

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from Supabase
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Error fetching jobs:', queryError);
        setError(queryError.message);
        return;
      }

      setJobs((data || []).map(mapDbJobToJob));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Erro ao carregar vagas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJobs]);

  // Get job by ID
  const getJobById = useCallback((id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  }, [jobs]);

  // Get published jobs (for public pages)
  const getPublishedJobs = useCallback((): Job[] => {
    return jobs.filter(job => job.status === 'publicada' && !job.isArchived);
  }, [jobs]);

  // Create new job
  const createJob = useCallback(async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job | null> => {
    try {
      const dbData = mapJobToDbInsert(jobData);
      
      const { data, error: insertError } = await supabase
        .from('jobs')
        .insert(dbData)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating job:', insertError);
        return null;
      }

      const newJob = mapDbJobToJob(data);
      return newJob;
    } catch (err) {
      console.error('Error creating job:', err);
      return null;
    }
  }, []);

  // Update existing job
  const updateJob = useCallback(async (id: string, updates: Partial<Job>): Promise<Job | null> => {
    try {
      const dbUpdates = mapJobToDbUpdate(updates);
      
      const { data, error: updateError } = await supabase
        .from('jobs')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating job:', updateError);
        return null;
      }

      return mapDbJobToJob(data);
    } catch (err) {
      console.error('Error updating job:', err);
      return null;
    }
  }, []);

  // Update job status
  const updateJobStatus = useCallback(async (id: string, status: JobStatus): Promise<Job | null> => {
    return updateJob(id, { status });
  }, [updateJob]);

  // Archive job
  const archiveJob = useCallback(async (id: string): Promise<Job | null> => {
    return updateJob(id, { isArchived: true });
  }, [updateJob]);

  // Save job (create or update)
  const saveJob = useCallback(async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Job | null> => {
    if (jobData.id) {
      const { id, ...updates } = jobData;
      return updateJob(id, updates);
    }
    return createJob(jobData);
  }, [createJob, updateJob]);

  return {
    jobs,
    isLoading,
    error,
    getJobById,
    getPublishedJobs,
    createJob,
    updateJob,
    updateJobStatus,
    archiveJob,
    saveJob,
    refetch: fetchJobs,
  };
}
