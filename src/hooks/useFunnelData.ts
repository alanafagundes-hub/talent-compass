import { useState, useEffect, useCallback } from 'react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
const supabase = supabaseClient as any;
import type { FunnelStep, Tag, Candidate } from '@/types/ats';

// Database row types
interface DbFunnelStage {
  id: string;
  funnel_id: string;
  name: string;
  order_index: number;
  color: string | null;
  is_archived: boolean;
  created_at: string;
}

interface DbFunnel {
  id: string;
  job_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface DbApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  current_stage_id: string | null;
  status: string;
  rating: number | null;
  notes: string | null;
  source: string | null;
  tracking_data: TrackingData | null;
  applied_at: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

interface TrackingData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string;
  landing_page: string;
}

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

interface DbApplicationTag {
  id: string;
  application_id: string;
  tag_id: string;
}

interface DbStageEvaluation {
  id: string;
  application_id: string;
  stage_id: string;
  rating: number | null;
  notes: string | null;
  evaluated_by: string | null;
  evaluated_at: string;
}

export interface FormResponse {
  id: string;
  fieldId: string;
  label: string;
  fieldType: string;
  value: string | null;
  fileUrl: string | null;
}

export interface StageHistoryEntry {
  stepId: string;
  stepName: string;
  enteredAt: Date;
  exitedAt?: Date;
}

export interface KanbanCardData {
  id: string;
  candidate: Candidate;
  stepId: string;
  status: 'ativa' | 'contratada' | 'incompativel' | 'desistente';
  sourceId?: string;
  sourceName?: string;
  trackingData?: TrackingData | null;
  rating?: number;
  notes?: string;
  tags?: Tag[];
  enteredAt: Date;
  appliedAt: Date;
  stageRatings?: {
    id: string;
    cardId: string;
    stepId: string;
    stepName: string;
    rating: number;
    notes?: string;
    evaluatedBy: string;
    evaluatedAt: Date;
  }[];
  formResponses?: FormResponse[];
  stageHistory?: StageHistoryEntry[];
}

export function useFunnelData(jobId: string | undefined) {
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [cards, setCards] = useState<KanbanCardData[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funnelId, setFunnelId] = useState<string | null>(null);

  // Fetch funnel and stages
  const fetchFunnelData = useCallback(async () => {
    if (!jobId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get funnel for this job
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('job_id', jobId)
        .eq('is_active', true)
        .maybeSingle();

      if (funnelError) throw funnelError;

      if (!funnelData) {
        setSteps([]);
        setCards([]);
        setIsLoading(false);
        return;
      }

      setFunnelId(funnelData.id);

      // 2. Get stages for this funnel
      const { data: stagesData, error: stagesError } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('funnel_id', funnelData.id)
        .eq('is_archived', false)
        .order('order_index');

      if (stagesError) throw stagesError;

      const mappedSteps: FunnelStep[] = (stagesData || []).map((stage: DbFunnelStage) => ({
        id: stage.id,
        jobId: jobId,
        name: stage.name,
        stage: 'triagem' as const,
        order: stage.order_index,
        color: stage.color || '#6366f1',
        isArchived: stage.is_archived,
        createdAt: new Date(stage.created_at),
      }));

      setSteps(mappedSteps);

      // 3. Get applications for this job with form responses
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          candidates (*),
          application_tags (
            tag_id,
            tags (*)
          ),
          stage_evaluations (*),
          form_responses (
            id,
            field_id,
            value,
            file_url,
            form_fields (
              id,
              label,
              field_type
            )
          ),
          application_history (
            id,
            from_stage_id,
            to_stage_id,
            action,
            created_at
          )
        `)
        .eq('job_id', jobId)
        .eq('is_archived', false)
        .in('status', ['ativa', 'contratada']);

      if (applicationsError) throw applicationsError;

      // 4. Map applications to cards
      const mappedCards: KanbanCardData[] = (applicationsData || []).map((app: any) => {
        const candidate: Candidate = {
          id: app.candidates.id,
          name: app.candidates.name,
          email: app.candidates.email,
          phone: app.candidates.phone || undefined,
          linkedinUrl: app.candidates.linkedin_url || undefined,
          portfolioUrl: app.candidates.portfolio_url || undefined,
          resumeUrl: app.candidates.resume_url || undefined,
          notes: app.candidates.notes || undefined,
          availability: app.candidates.availability || undefined,
          tags: [],
          status: 'ativo',
          isArchived: app.candidates.is_archived,
          isInTalentPool: app.candidates.is_in_talent_pool,
          createdAt: new Date(app.candidates.created_at),
          updatedAt: new Date(app.candidates.updated_at),
        };

        const cardTags: Tag[] = (app.application_tags || [])
          .filter((at: any) => at.tags)
          .map((at: any) => ({
            id: at.tags.id,
            name: at.tags.name,
            color: at.tags.color,
            isArchived: at.tags.is_archived,
            createdAt: new Date(at.tags.created_at),
          }));

        const stageRatings = (app.stage_evaluations || []).map((ev: any) => {
          const step = mappedSteps.find(s => s.id === ev.stage_id);
          return {
            id: ev.id,
            cardId: app.id,
            stepId: ev.stage_id,
            stepName: step?.name || 'Desconhecida',
            rating: ev.rating || 0,
            notes: ev.notes || undefined,
            evaluatedBy: ev.evaluated_by || 'admin',
            evaluatedAt: new Date(ev.evaluated_at),
          };
        });

        // Map form responses
        const formResponses: FormResponse[] = (app.form_responses || [])
          .filter((fr: any) => fr.form_fields)
          .map((fr: any) => ({
            id: fr.id,
            fieldId: fr.field_id,
            label: fr.form_fields.label,
            fieldType: fr.form_fields.field_type,
            value: fr.value,
            fileUrl: fr.file_url,
          }));

        // Build stage history from application_history
        const stageHistory: StageHistoryEntry[] = [];
        const historyEvents = (app.application_history || [])
          .filter((h: any) => h.action === 'moved' || h.action === 'applied')
          .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
        for (const event of historyEvents) {
          if (event.to_stage_id) {
            const step = mappedSteps.find(s => s.id === event.to_stage_id);
            if (step) {
              // Close previous entry
              if (stageHistory.length > 0 && !stageHistory[stageHistory.length - 1].exitedAt) {
                stageHistory[stageHistory.length - 1].exitedAt = new Date(event.created_at);
              }
              stageHistory.push({
                stepId: event.to_stage_id,
                stepName: step.name,
                enteredAt: new Date(event.created_at),
              });
            }
          }
        }

        // Find the first stage if current_stage_id is null
        const defaultStepId = mappedSteps.length > 0 ? mappedSteps[0].id : '';
        
        return {
          id: app.id,
          candidate,
          stepId: app.current_stage_id || defaultStepId,
          status: app.status as 'ativa' | 'contratada' | 'incompativel' | 'desistente',
          sourceName: app.source || undefined,
          trackingData: app.tracking_data || undefined,
          rating: app.rating || undefined,
          notes: app.notes || undefined,
          tags: cardTags,
          enteredAt: new Date(app.applied_at),
          appliedAt: new Date(app.applied_at),
          stageRatings,
          formResponses,
          stageHistory,
        };
      });

      setCards(mappedCards);

      // 5. Get all tags for filtering
      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .eq('is_archived', false);

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
      console.error('Error fetching funnel data:', err);
      setError(err.message || 'Erro ao carregar dados do funil');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  // Move card to new stage
  const moveCard = useCallback(async (cardId: string, fromStepId: string, toStepId: string) => {
    try {
      // Update application's current_stage_id
      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          current_stage_id: toStepId,
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId);

      if (updateError) throw updateError;

      // Add to history
      await supabase.from('application_history').insert({
        application_id: cardId,
        from_stage_id: fromStepId,
        to_stage_id: toStepId,
        action: 'moved',
        notes: `Movido de etapa`,
      });

      // Update local state
      setCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, stepId: toStepId, enteredAt: new Date() }
          : c
      ));

      return true;
    } catch (err: any) {
      console.error('Error moving card:', err);
      return false;
    }
  }, []);

  // Save stage rating
  const saveRating = useCallback(async (
    cardId: string, 
    stepId: string, 
    rating: number, 
    notes?: string
  ) => {
    try {
      // Check if rating exists
      const { data: existing } = await supabase
        .from('stage_evaluations')
        .select('id')
        .eq('application_id', cardId)
        .eq('stage_id', stepId)
        .maybeSingle();

      if (existing) {
        // Update existing
        await supabase
          .from('stage_evaluations')
          .update({ rating, notes, evaluated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        // Insert new
        await supabase.from('stage_evaluations').insert({
          application_id: cardId,
          stage_id: stepId,
          rating,
          notes,
        });
      }

      // Also update the application's general rating
      await supabase
        .from('applications')
        .update({ rating, updated_at: new Date().toISOString() })
        .eq('id', cardId);

      // Refetch to update local state
      await fetchFunnelData();
      return true;
    } catch (err: any) {
      console.error('Error saving rating:', err);
      return false;
    }
  }, [fetchFunnelData]);

  // Mark as lost/incompatible
  const markAsLost = useCallback(async (
    cardId: string,
    reasonId: string,
    observation?: string
  ) => {
    try {
      // Update application status
      await supabase
        .from('applications')
        .update({ 
          status: 'incompativel',
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId);

      // Add to rejected_applications
      await supabase.from('rejected_applications').insert({
        application_id: cardId,
        reason_id: reasonId,
        observation,
        can_reapply: true,
      });

      // Update local state - remove from cards
      setCards(prev => prev.filter(c => c.id !== cardId));

      return true;
    } catch (err: any) {
      console.error('Error marking as lost:', err);
      return false;
    }
  }, []);

  // Save funnel steps
  const saveSteps = useCallback(async (newSteps: FunnelStep[]) => {
    if (!funnelId) return false;

    try {
      // Get current steps from DB
      const { data: currentSteps } = await supabase
        .from('funnel_stages')
        .select('id')
        .eq('funnel_id', funnelId);

      const currentIds = (currentSteps || []).map(s => s.id);
      const newIds = newSteps.filter(s => !s.id.startsWith('new-')).map(s => s.id);

      // Delete removed steps (archive them)
      const toArchive = currentIds.filter(id => !newIds.includes(id));
      if (toArchive.length > 0) {
        await supabase
          .from('funnel_stages')
          .update({ is_archived: true })
          .in('id', toArchive);
      }

      // Update existing and insert new
      for (const step of newSteps) {
        if (step.id.startsWith('new-')) {
          // Insert new step
          await supabase.from('funnel_stages').insert({
            funnel_id: funnelId,
            name: step.name,
            order_index: step.order,
            color: step.color,
          });
        } else {
          // Update existing
          await supabase
            .from('funnel_stages')
            .update({
              name: step.name,
              order_index: step.order,
              color: step.color,
            })
            .eq('id', step.id);
        }
      }

      await fetchFunnelData();
      return true;
    } catch (err: any) {
      console.error('Error saving steps:', err);
      return false;
    }
  }, [funnelId, fetchFunnelData]);

  // Initial fetch
  useEffect(() => {
    fetchFunnelData();
  }, [fetchFunnelData]);

  // Real-time subscription
  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel(`funnel-${jobId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications', filter: `job_id=eq.${jobId}` },
        () => fetchFunnelData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'funnel_stages' },
        () => fetchFunnelData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, fetchFunnelData]);

  // Add tag to application
  const addTag = useCallback(async (cardId: string, tagId: string) => {
    try {
      // Optimistic update
      const tagToAdd = tags.find(t => t.id === tagId);
      if (tagToAdd) {
        setCards(prev => prev.map(c => 
          c.id === cardId 
            ? { ...c, tags: [...(c.tags || []), tagToAdd] }
            : c
        ));
      }

      // Insert into database
      const { error } = await supabase
        .from('application_tags')
        .insert({
          application_id: cardId,
          tag_id: tagId,
        });

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error adding tag:', err);
      // Revert optimistic update
      setCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, tags: (c.tags || []).filter(t => t.id !== tagId) }
          : c
      ));
      return false;
    }
  }, [tags]);

  // Remove tag from application
  const removeTag = useCallback(async (cardId: string, tagId: string) => {
    try {
      // Store original tags for potential rollback
      const card = cards.find(c => c.id === cardId);
      const originalTags = card?.tags || [];

      // Optimistic update
      setCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, tags: (c.tags || []).filter(t => t.id !== tagId) }
          : c
      ));

      // Delete from database
      const { error } = await supabase
        .from('application_tags')
        .delete()
        .eq('application_id', cardId)
        .eq('tag_id', tagId);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error removing tag:', err);
      // Revert on error
      await fetchFunnelData();
      return false;
    }
  }, [cards, fetchFunnelData]);

  return {
    steps,
    cards,
    tags,
    isLoading,
    error,
    funnelId,
    moveCard,
    saveRating,
    markAsLost,
    saveSteps,
    addTag,
    removeTag,
    refetch: fetchFunnelData,
    setCards, // For local optimistic updates
  };
}
