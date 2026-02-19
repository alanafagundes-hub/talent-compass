import { useState, useEffect, useCallback } from 'react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
const supabase = supabaseClient as any;
import type { Candidate, Tag, CandidateAvailability } from '@/types/ats';

interface DbCandidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  notes: string | null;
  source: string | null;
  availability: string | null;
  is_in_talent_pool: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

interface DbTag {
  id: string;
  name: string;
  color: string;
  is_archived: boolean;
  created_at: string;
}

export interface TalentPoolCandidate extends Omit<Candidate, 'tags'> {
  fitCultural?: number | null; // From "Entrevista RH" stage rating
  tags: Tag[];
  appliedJobsCount: number;
  lastActivity: Date;
  jobsHistory: {
    jobId: string;
    jobTitle: string;
    status: string;
    appliedAt: Date;
    currentStage?: string;
    stageRatings: {
      stageName: string;
      rating: number | null;
      notes?: string;
    }[];
  }[];
}

export function useTalentPool() {
  const [candidates, setCandidates] = useState<TalentPoolCandidate[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch candidates that are in talent pool
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select(`
          *,
          applications (
            id,
            job_id,
            status,
            applied_at,
            current_stage_id,
            jobs (
              id,
              title
            ),
            funnel_stages:current_stage_id (
              name
            ),
            stage_evaluations (
              stage_id,
              rating,
              notes,
              funnel_stages (
                name
              )
            ),
            application_tags (
              tag_id,
              tags (*)
            )
          )
        `)
        .eq('is_in_talent_pool', true)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (candidatesError) throw candidatesError;

      // Map to TalentPoolCandidate
      const mappedCandidates: TalentPoolCandidate[] = (candidatesData || []).map((c: any) => {
        // Extract tags from all applications
        const allTags: Tag[] = [];
        const seenTagIds = new Set<string>();
        
        (c.applications || []).forEach((app: any) => {
          (app.application_tags || []).forEach((at: any) => {
            if (at.tags && !seenTagIds.has(at.tags.id)) {
              seenTagIds.add(at.tags.id);
              allTags.push({
                id: at.tags.id,
                name: at.tags.name,
                color: at.tags.color,
                isArchived: at.tags.is_archived,
                createdAt: new Date(at.tags.created_at),
              });
            }
          });
        });

        // Find Fit Cultural (rating from "Entrevista RH" stage)
        let fitCultural: number | null = null;
        for (const app of c.applications || []) {
          for (const ev of app.stage_evaluations || []) {
            const stageName = ev.funnel_stages?.name?.toLowerCase() || '';
            if (stageName.includes('entrevista rh') && ev.rating) {
              fitCultural = ev.rating;
              break;
            }
          }
          if (fitCultural) break;
        }

        // Build jobs history
        const jobsHistory = (c.applications || []).map((app: any) => ({
          jobId: app.job_id,
          jobTitle: app.jobs?.title || 'Vaga',
          status: app.status,
          appliedAt: new Date(app.applied_at),
          currentStage: app.funnel_stages?.name,
          stageRatings: (app.stage_evaluations || []).map((ev: any) => ({
            stageName: ev.funnel_stages?.name || 'Etapa',
            rating: ev.rating,
            notes: ev.notes,
          })),
        }));

        // Find last activity
        const lastApp = (c.applications || [])
          .sort((a: any, b: any) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())[0];

        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || undefined,
          linkedinUrl: c.linkedin_url || undefined,
          portfolioUrl: c.portfolio_url || undefined,
          resumeUrl: c.resume_url || undefined,
          notes: c.notes || undefined,
          availability: (c.availability as CandidateAvailability) || 'open_to_opportunities',
          status: 'ativo' as const,
          isArchived: c.is_archived,
          isInTalentPool: c.is_in_talent_pool,
          createdAt: new Date(c.created_at),
          updatedAt: new Date(c.updated_at),
          tags: allTags,
          fitCultural,
          appliedJobsCount: (c.applications || []).length,
          lastActivity: lastApp ? new Date(lastApp.applied_at) : new Date(c.updated_at),
          jobsHistory,
        };
      });

      setCandidates(mappedCandidates);

      // Fetch all available tags
      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .eq('is_archived', false)
        .order('name');

      if (tagsData) {
        setTags(tagsData.map((t: DbTag) => ({
          id: t.id,
          name: t.name,
          color: t.color,
          isArchived: t.is_archived,
          createdAt: new Date(t.created_at),
        })));
      }
    } catch (err: any) {
      console.error('Error fetching talent pool:', err);
      setError(err.message || 'Erro ao carregar banco de talentos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update candidate availability
  const updateAvailability = useCallback(async (
    candidateId: string,
    availability: CandidateAvailability
  ) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ availability, updated_at: new Date().toISOString() })
        .eq('id', candidateId);

      if (error) throw error;

      setCandidates(prev => prev.map(c =>
        c.id === candidateId ? { ...c, availability } : c
      ));

      return true;
    } catch (err: any) {
      console.error('Error updating availability:', err);
      return false;
    }
  }, []);

  // Archive candidate
  const archiveCandidate = useCallback(async (candidateId: string) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ is_archived: true, updated_at: new Date().toISOString() })
        .eq('id', candidateId);

      if (error) throw error;

      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      return true;
    } catch (err: any) {
      console.error('Error archiving candidate:', err);
      return false;
    }
  }, []);

  // Link candidate to another job
  const linkToJob = useCallback(async (candidateId: string, jobId: string) => {
    try {
      // Get the first stage of the job's funnel
      const { data: funnelData } = await supabase
        .from('funnels')
        .select('id')
        .eq('job_id', jobId)
        .eq('is_active', true)
        .maybeSingle();

      if (!funnelData) throw new Error('Funil não encontrado');

      const { data: firstStage } = await supabase
        .from('funnel_stages')
        .select('id')
        .eq('funnel_id', funnelData.id)
        .eq('is_archived', false)
        .order('order_index')
        .limit(1)
        .maybeSingle();

      // Create new application
      const { error } = await supabase
        .from('applications')
        .insert({
          candidate_id: candidateId,
          job_id: jobId,
          current_stage_id: firstStage?.id || null,
          status: 'ativa',
          source: 'Banco de Talentos',
        });

      if (error) throw error;

      await fetchCandidates();
      return true;
    } catch (err: any) {
      console.error('Error linking to job:', err);
      return false;
    }
  }, [fetchCandidates]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('talent-pool-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, fetchCandidates)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, fetchCandidates)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'application_tags' }, fetchCandidates)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCandidates]);

  return {
    candidates,
    tags,
    isLoading,
    error,
    refetch: fetchCandidates,
    updateAvailability,
    archiveCandidate,
    linkToJob,
  };
}
