import { useState, useEffect, useCallback } from 'react';
import type { Job, JobStatus } from '@/types/ats';

const STORAGE_KEY = 'ats_jobs';
const CUSTOM_EVENT_NAME = 'jobsUpdated';

// No seed data - system starts empty, jobs are created by users only
const initialJobs: Job[] = [];

// Helper to parse dates from localStorage
const parseJobDates = (job: Job): Job => ({
  ...job,
  createdAt: new Date(job.createdAt),
  updatedAt: new Date(job.updatedAt),
});

// Load jobs from localStorage
const loadFromStorage = (): Job[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Job[];
      return parsed.map(parseJobDates);
    }
  } catch (error) {
    console.error('Error loading jobs from storage:', error);
  }
  return initialJobs;
};

// Save jobs to localStorage
const saveToStorage = (jobs: Job[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME));
  } catch (error) {
    console.error('Error saving jobs to storage:', error);
  }
};

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(() => loadFromStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Sync with other tabs/components and reload on focus
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setJobs(loadFromStorage());
      }
    };

    const handleCustomEvent = () => {
      setJobs(loadFromStorage());
    };

    // Reload jobs when window gains focus (catches updates from other tabs/sessions)
    const handleFocus = () => {
      setJobs(loadFromStorage());
    };

    // Also reload on visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setJobs(loadFromStorage());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Get all jobs
  const getJobs = useCallback(() => jobs, [jobs]);

  // Get job by ID
  const getJobById = useCallback((id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  }, [jobs]);

  // Get published jobs (for public pages)
  const getPublishedJobs = useCallback((): Job[] => {
    return jobs.filter(job => job.status === 'publicada' && !job.isArchived);
  }, [jobs]);

  // Create new job
  const createJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    saveToStorage(updatedJobs);
    
    return newJob;
  }, [jobs]);

  // Update existing job
  const updateJob = useCallback((id: string, updates: Partial<Job>): Job | undefined => {
    let updatedJob: Job | undefined;
    
    const updatedJobs = jobs.map(job => {
      if (job.id === id) {
        updatedJob = { ...job, ...updates, updatedAt: new Date() };
        return updatedJob;
      }
      return job;
    });
    
    if (updatedJob) {
      setJobs(updatedJobs);
      saveToStorage(updatedJobs);
    }
    
    return updatedJob;
  }, [jobs]);

  // Update job status
  const updateJobStatus = useCallback((id: string, status: JobStatus): Job | undefined => {
    return updateJob(id, { status });
  }, [updateJob]);

  // Archive job
  const archiveJob = useCallback((id: string): Job | undefined => {
    return updateJob(id, { isArchived: true });
  }, [updateJob]);

  // Save job (create or update)
  const saveJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Job => {
    if (jobData.id) {
      const { id, ...updates } = jobData;
      const updated = updateJob(id, updates);
      if (updated) return updated;
    }
    return createJob(jobData);
  }, [createJob, updateJob]);

  return {
    jobs,
    isLoading,
    getJobs,
    getJobById,
    getPublishedJobs,
    createJob,
    updateJob,
    updateJobStatus,
    archiveJob,
    saveJob,
  };
}

// Export for direct usage without hook (for components that just need data)
export const getJobsFromStorage = loadFromStorage;
export const getJobByIdFromStorage = (id: string): Job | undefined => {
  const jobs = loadFromStorage();
  return jobs.find(job => job.id === id);
};
