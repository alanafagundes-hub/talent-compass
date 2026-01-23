/**
 * Serviço de Métricas do ATS
 * 
 * Este módulo centraliza a coleta e estrutura de dados para métricas futuras.
 * Todas as operações de registro de métricas devem passar por aqui.
 */

import type { 
  Card, 
  CardHistory, 
  CardStageHistory, 
  CardStageRating,
  JobMetrics,
  FunnelStep,
  LostCandidate 
} from '@/types/ats';

// ============================================
// TIPOS INTERNOS PARA MÉTRICAS
// ============================================

interface MetricsEvent {
  type: 'application' | 'stage_change' | 'rating' | 'lost' | 'hired';
  timestamp: Date;
  data: Record<string, any>;
}

// ============================================
// FUNÇÕES DE REGISTRO DE MÉTRICAS
// ============================================

/**
 * Registra uma nova candidatura com fonte
 */
export function createApplicationMetrics(params: {
  cardId: string;
  candidateId: string;
  jobId: string;
  stepId: string;
  stepName: string;
  stepOrder: number;
  sourceId?: string;
  sourceName?: string;
}): { history: CardHistory; stageHistory: CardStageHistory } {
  const now = new Date();
  
  const history: CardHistory = {
    id: `h-${Date.now()}`,
    cardId: params.cardId,
    toStepId: params.stepId,
    toStepName: params.stepName,
    action: 'applied',
    notes: `Candidatura recebida${params.sourceName ? ` via ${params.sourceName}` : ''}`,
    createdBy: 'system',
    createdAt: now,
  };

  const stageHistory: CardStageHistory = {
    id: `sh-${Date.now()}`,
    cardId: params.cardId,
    stepId: params.stepId,
    stepName: params.stepName,
    stepOrder: params.stepOrder,
    enteredAt: now,
  };

  return { history, stageHistory };
}

/**
 * Registra movimentação entre etapas com cálculo de tempo
 */
export function createStageChangeMetrics(params: {
  cardId: string;
  fromStep: FunnelStep;
  toStep: FunnelStep;
  previousStageEntry?: CardStageHistory;
  createdBy?: string;
}): { 
  history: CardHistory; 
  updatedPreviousStage?: Partial<CardStageHistory>; 
  newStageHistory: CardStageHistory;
} {
  const now = new Date();
  
  // Determine exit reason based on stage order
  const exitReason: CardStageHistory['exitReason'] = 
    params.toStep.order > params.fromStep.order ? 'advanced' : 'moved_back';

  const history: CardHistory = {
    id: `h-${Date.now()}`,
    cardId: params.cardId,
    fromStepId: params.fromStep.id,
    fromStepName: params.fromStep.name,
    toStepId: params.toStep.id,
    toStepName: params.toStep.name,
    action: 'moved',
    notes: `Movido de "${params.fromStep.name}" para "${params.toStep.name}"`,
    createdBy: params.createdBy || 'admin',
    createdAt: now,
  };

  // Calculate duration in previous stage
  let updatedPreviousStage: Partial<CardStageHistory> | undefined;
  if (params.previousStageEntry) {
    const duration = Math.floor(
      (now.getTime() - params.previousStageEntry.enteredAt.getTime()) / 60000
    );
    updatedPreviousStage = {
      exitedAt: now,
      duration,
      exitReason,
    };
  }

  const newStageHistory: CardStageHistory = {
    id: `sh-${Date.now()}`,
    cardId: params.cardId,
    stepId: params.toStep.id,
    stepName: params.toStep.name,
    stepOrder: params.toStep.order,
    enteredAt: now,
  };

  return { history, updatedPreviousStage, newStageHistory };
}

/**
 * Registra avaliação/nota em uma etapa
 */
export function createStageRatingMetrics(params: {
  cardId: string;
  stepId: string;
  stepName: string;
  rating: number;
  notes?: string;
  evaluatedBy?: string;
}): CardStageRating {
  return {
    id: `sr-${Date.now()}`,
    cardId: params.cardId,
    stepId: params.stepId,
    stepName: params.stepName,
    rating: Math.min(5, Math.max(1, params.rating)), // Ensure 1-5 range
    notes: params.notes,
    evaluatedBy: params.evaluatedBy || 'admin',
    evaluatedAt: new Date(),
  };
}

/**
 * Registra candidato marcado como perdido
 */
export function createLostMetrics(params: {
  cardId: string;
  stepId: string;
  stepName: string;
  reasonName: string;
  previousStageEntry?: CardStageHistory;
}): { 
  history: CardHistory; 
  updatedPreviousStage?: Partial<CardStageHistory>;
} {
  const now = new Date();

  const history: CardHistory = {
    id: `h-${Date.now()}`,
    cardId: params.cardId,
    fromStepId: params.stepId,
    fromStepName: params.stepName,
    toStepId: 'lost',
    toStepName: 'Perdido',
    action: 'marked_as_lost',
    notes: `Marcado como incompatível: ${params.reasonName}`,
    createdBy: 'admin',
    createdAt: now,
  };

  let updatedPreviousStage: Partial<CardStageHistory> | undefined;
  if (params.previousStageEntry) {
    const duration = Math.floor(
      (now.getTime() - params.previousStageEntry.enteredAt.getTime()) / 60000
    );
    updatedPreviousStage = {
      exitedAt: now,
      duration,
      exitReason: 'lost',
    };
  }

  return { history, updatedPreviousStage };
}

/**
 * Registra contratação
 */
export function createHiredMetrics(params: {
  cardId: string;
  stepId: string;
  stepName: string;
  previousStageEntry?: CardStageHistory;
}): { 
  history: CardHistory; 
  updatedPreviousStage?: Partial<CardStageHistory>;
} {
  const now = new Date();

  const history: CardHistory = {
    id: `h-${Date.now()}`,
    cardId: params.cardId,
    fromStepId: params.stepId,
    fromStepName: params.stepName,
    toStepId: 'hired',
    toStepName: 'Contratado',
    action: 'hired',
    notes: 'Candidato contratado',
    createdBy: 'admin',
    createdAt: now,
  };

  let updatedPreviousStage: Partial<CardStageHistory> | undefined;
  if (params.previousStageEntry) {
    const duration = Math.floor(
      (now.getTime() - params.previousStageEntry.enteredAt.getTime()) / 60000
    );
    updatedPreviousStage = {
      exitedAt: now,
      duration,
      exitReason: 'hired',
    };
  }

  return { history, updatedPreviousStage };
}

// ============================================
// FUNÇÕES DE CÁLCULO DE MÉTRICAS (para uso futuro)
// ============================================

/**
 * Calcula tempo médio por etapa para uma vaga
 */
export function calculateAverageTimeByStage(
  stageHistories: CardStageHistory[]
): Record<string, number> {
  const stageData: Record<string, { total: number; count: number }> = {};

  stageHistories.forEach(history => {
    if (history.duration !== undefined && history.exitedAt) {
      if (!stageData[history.stepId]) {
        stageData[history.stepId] = { total: 0, count: 0 };
      }
      stageData[history.stepId].total += history.duration;
      stageData[history.stepId].count += 1;
    }
  });

  const averages: Record<string, number> = {};
  Object.entries(stageData).forEach(([stepId, data]) => {
    averages[stepId] = data.count > 0 ? Math.round(data.total / data.count) : 0;
  });

  return averages;
}

/**
 * Calcula taxa de conversão entre etapas
 */
export function calculateConversionRates(
  stageHistories: CardStageHistory[],
  steps: FunnelStep[]
): Record<string, { entered: number; advanced: number; rate: number }> {
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const conversions: Record<string, { entered: number; advanced: number; rate: number }> = {};

  sortedSteps.forEach(step => {
    const entered = stageHistories.filter(h => h.stepId === step.id).length;
    const advanced = stageHistories.filter(
      h => h.stepId === step.id && h.exitReason === 'advanced'
    ).length;
    
    conversions[step.id] = {
      entered,
      advanced,
      rate: entered > 0 ? Math.round((advanced / entered) * 100) : 0,
    };
  });

  return conversions;
}

/**
 * Agrupa candidaturas por fonte
 */
export function calculateApplicationsBySource(
  cards: Pick<Card, 'sourceId' | 'sourceName'>[]
): Record<string, number> {
  const sources: Record<string, number> = {};

  cards.forEach(card => {
    const sourceKey = card.sourceName || 'Não informado';
    sources[sourceKey] = (sources[sourceKey] || 0) + 1;
  });

  return sources;
}

/**
 * Calcula média de notas por etapa
 */
export function calculateAverageRatingByStage(
  ratings: CardStageRating[]
): Record<string, { average: number; count: number }> {
  const stageData: Record<string, { total: number; count: number }> = {};

  ratings.forEach(rating => {
    if (!stageData[rating.stepId]) {
      stageData[rating.stepId] = { total: 0, count: 0 };
    }
    stageData[rating.stepId].total += rating.rating;
    stageData[rating.stepId].count += 1;
  });

  const averages: Record<string, { average: number; count: number }> = {};
  Object.entries(stageData).forEach(([stepId, data]) => {
    averages[stepId] = {
      average: data.count > 0 ? Math.round((data.total / data.count) * 10) / 10 : 0,
      count: data.count,
    };
  });

  return averages;
}

/**
 * Calcula tempo médio até contratação
 */
export function calculateAverageTimeToHire(
  cards: Pick<Card, 'id' | 'appliedAt'>[],
  histories: CardHistory[]
): number | null {
  const hiredEvents = histories.filter(h => h.action === 'hired');
  if (hiredEvents.length === 0) return null;

  let totalDays = 0;
  let count = 0;

  hiredEvents.forEach(event => {
    const card = cards.find(c => c.id === event.cardId);
    if (card) {
      const days = Math.floor(
        (event.createdAt.getTime() - card.appliedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalDays += days;
      count += 1;
    }
  });

  return count > 0 ? Math.round(totalDays / count) : null;
}
