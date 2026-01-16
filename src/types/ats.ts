// Tipos base do sistema ATS DOT

export type AreaType = 'comercial' | 'criacao' | 'tech' | 'marketing' | 'rh' | 'financeiro' | 'operacoes';

export type FunnelStage = 
  | 'triagem' 
  | 'entrevista_rh' 
  | 'teste_tecnico' 
  | 'entrevista_gestor' 
  | 'proposta' 
  | 'contratado';

export type CandidateStatus = 'ativo' | 'arquivado' | 'perdido';

export type JobStatus = 'aberta' | 'pausada' | 'fechada' | 'arquivada';

export type LostReason = 
  | 'salario' 
  | 'perfil_inadequado' 
  | 'desistencia' 
  | 'outra_proposta' 
  | 'sem_retorno' 
  | 'reprovado_teste'
  | 'reprovado_entrevista'
  | 'outros';

// Entidades principais

export interface Area {
  id: string;
  name: string;
  type: AreaType;
  description?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  notes?: string;
  tags: string[];
  status: CandidateStatus;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  areaId: string;
  description: string;
  requirements?: string;
  salary?: {
    min: number;
    max: number;
  };
  location?: string;
  isRemote: boolean;
  status: JobStatus;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  deadline?: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelStep {
  id: string;
  jobId: string;
  name: string;
  stage: FunnelStage;
  order: number;
  isArchived: boolean;
  createdAt: Date;
}

export interface Card {
  id: string;
  candidateId: string;
  jobId: string;
  currentStepId: string;
  rating?: number;
  notes?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardHistory {
  id: string;
  cardId: string;
  fromStepId?: string;
  toStepId: string;
  action: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface Form {
  id: string;
  name: string;
  jobId?: string;
  fields: FormField[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date';
  required: boolean;
  options?: string[];
  order: number;
}

export interface LostCandidate {
  id: string;
  candidateId: string;
  jobId: string;
  cardId: string;
  reason: LostReason;
  reasonDetails?: string;
  canReapply: boolean;
  reapplyAfter?: Date;
  createdAt: Date;
}

// Stats para Dashboard
export interface DashboardStats {
  totalCandidates: number;
  activeCandidates: number;
  openJobs: number;
  candidatesInProcess: number;
  hiredThisMonth: number;
  lostThisMonth: number;
  averageTimeToHire: number;
  conversionRate: number;
}

export interface JobWithStats extends Job {
  totalCandidates: number;
  candidatesByStage: Record<FunnelStage, number>;
}
