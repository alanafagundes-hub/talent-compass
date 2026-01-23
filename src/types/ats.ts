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

export type JobStatus = 'rascunho' | 'publicada' | 'pausada' | 'encerrada';

export type JobLevel = 'estagio' | 'junior' | 'pleno' | 'senior' | 'especialista' | 'coordenador' | 'gerente' | 'diretor';

export type ContractType = 'clt' | 'pj' | 'estagio' | 'temporario' | 'freelancer';

export type LostReason = 
  | 'salario' 
  | 'perfil_inadequado' 
  | 'desistencia' 
  | 'outra_proposta' 
  | 'sem_retorno' 
  | 'reprovado_teste'
  | 'reprovado_entrevista'
  | 'outros';

export type FormFieldType = 'short_text' | 'long_text' | 'multiple_choice' | 'yes_no' | 'file_upload';

export type EmailTemplateType = 'confirmation' | 'rejection' | 'interview_invite' | 'offer' | 'custom';

// Entidades principais

export interface Area {
  id: string;
  name: string;
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
  sourceId?: string;
  status: CandidateStatus;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  areaId: string;
  level: JobLevel;
  contractType: ContractType;
  location: string;
  isRemote: boolean;
  description: string;
  requirements?: string;
  salary?: {
    min: number;
    max: number;
  };
  sourceId?: string;
  status: JobStatus;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  deadline?: Date;
  formTemplateId?: string;
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
  color?: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface Card {
  id: string;
  candidateId: string;
  jobId: string;
  currentStepId: string;
  sourceId?: string; // Fonte da candidatura (LinkedIn, Indicação, Site, etc.)
  sourceName?: string;
  rating?: number; // Rating geral do candidato
  notes?: string;
  appliedAt: Date; // Data/hora da candidatura
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardHistory {
  id: string;
  cardId: string;
  fromStepId?: string;
  fromStepName?: string;
  toStepId: string;
  toStepName?: string;
  action: 'applied' | 'moved' | 'marked_as_lost' | 'hired' | 'note_added' | 'rating_changed';
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface CardStageHistory {
  id: string;
  cardId: string;
  stepId: string;
  stepName: string;
  stepOrder: number;
  enteredAt: Date;
  exitedAt?: Date;
  duration?: number; // em minutos
  exitReason?: 'advanced' | 'lost' | 'hired' | 'moved_back'; // Por que saiu da etapa
}

// Avaliação por etapa - permite múltiplas notas em diferentes etapas
export interface CardStageRating {
  id: string;
  cardId: string;
  stepId: string;
  stepName: string;
  rating: number; // 1-5
  notes?: string;
  evaluatedBy: string;
  evaluatedAt: Date;
}

// Métricas agregadas por vaga (para cálculos futuros)
export interface JobMetrics {
  jobId: string;
  totalApplications: number;
  applicationsBySource: Record<string, number>;
  conversionByStage: Record<string, { entered: number; advanced: number; rate: number }>;
  averageTimeByStage: Record<string, number>; // em minutos
  totalHired: number;
  totalLost: number;
  averageTimeToHire?: number; // em dias
  lastUpdated: Date;
}

// Etapas padrão do funil
export const defaultFunnelStages = [
  { name: 'Inscritos', order: 1, color: '#6366f1' },
  { name: 'Triagem RH', order: 2, color: '#8b5cf6' },
  { name: 'Entrevista RH', order: 3, color: '#a855f7' },
  { name: 'Entrevista Técnica', order: 4, color: '#d946ef' },
  { name: 'Entrevista Final', order: 5, color: '#ec4899' },
  { name: 'Oferta', order: 6, color: '#f97316' },
  { name: 'Contratado', order: 7, color: '#22c55e' },
] as const;

export interface Tag {
  id: string;
  name: string;
  color: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  isDefault: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  order: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: EmailTemplateType;
  subject: string;
  body: string;
  isDefault: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncompatibilityReason {
  id: string;
  name: string;
  description?: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface CandidateSource {
  id: string;
  name: string;
  icon?: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface LostCandidate {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  areaId: string;
  areaName: string;
  cardId: string;
  stepId: string;
  stepName: string;
  reasonId: string;
  reasonName: string;
  observation?: string;
  canReapply: boolean;
  reapplyAfter?: Date;
  lostAt: Date;
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

// Labels para exibição
export const jobLevelLabels: Record<JobLevel, string> = {
  estagio: 'Estágio',
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
  especialista: 'Especialista',
  coordenador: 'Coordenador',
  gerente: 'Gerente',
  diretor: 'Diretor',
};

export const contractTypeLabels: Record<ContractType, string> = {
  clt: 'CLT',
  pj: 'PJ',
  estagio: 'Estágio',
  temporario: 'Temporário',
  freelancer: 'Freelancer',
};

export const jobStatusLabels: Record<JobStatus, string> = {
  rascunho: 'Rascunho',
  publicada: 'Publicada',
  pausada: 'Pausada',
  encerrada: 'Encerrada',
};
