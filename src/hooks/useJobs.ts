import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Job, JobStatus } from '@/types/ats';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type DbJob = Tables<'jobs'>;

// Map database job to application Job type
const mapDbJobToJob = (dbJob: DbJob): Job => ({
  id: dbJob.id,
  title: dbJob.title,
  description: dbJob.description,
  requirements: dbJob.requirements || undefined,
  level: dbJob.level,
  contractType: dbJob.contract_type,
  location: dbJob.location,
  isRemote: dbJob.is_remote,
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
const mapJobToDbInsert = (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): TablesInsert<'jobs'> => ({
  title: job.title,
  description: job.description,
  requirements: job.requirements || null,
  level: job.level,
  contract_type: job.contractType,
  location: job.location,
  is_remote: job.isRemote,
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
});

// Map application Job updates to database update format
const mapJobToDbUpdate = (updates: Partial<Job>): TablesUpdate<'jobs'> => {
  const dbUpdates: TablesUpdate<'jobs'> = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.requirements !== undefined) dbUpdates.requirements = updates.requirements || null;
  if (updates.level !== undefined) dbUpdates.level = updates.level;
  if (updates.contractType !== undefined) dbUpdates.contract_type = updates.contractType;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.isRemote !== undefined) dbUpdates.is_remote = updates.isRemote;
  if (updates.salary !== undefined) {
    dbUpdates.salary_min = updates.salary?.min || null;
    dbUpdates.salary_max = updates.salary?.max || null;
  }
  if (updates.status !== undefined) {
    dbUpdates.status = updates.status;
    // Set published_at when publishing
    if (updates.status === 'publicada') {
      dbUpdates.published_at = new Date().toISOString();
    }
    // Set closed_at when closing
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
  
  return dbUpdates;
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
