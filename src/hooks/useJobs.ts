import { useState, useEffect, useCallback } from 'react';
import type { Job, JobStatus } from '@/types/ats';

const STORAGE_KEY = 'ats_jobs';
const CUSTOM_EVENT_NAME = 'jobsUpdated';

// Initial seed data for first time users
const initialJobs: Job[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Senior",
    areaId: "1",
    level: "senior",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: true,
    description: `Estamos buscando um Desenvolvedor Frontend Senior para liderar projetos de alta complexidade e contribuir com a evolução técnica do time.

**Responsabilidades:**
- Desenvolver interfaces web modernas e responsivas
- Liderar tecnicamente projetos e mentorear desenvolvedores mais junior
- Participar ativamente de decisões de arquitetura
- Garantir qualidade de código através de code reviews
- Colaborar com designers e product managers

**Benefícios:**
- Plano de saúde e odontológico
- Vale refeição e alimentação
- Gympass
- Home office flexível
- PLR`,
    requirements: `- 5+ anos de experiência com desenvolvimento frontend
- Domínio de React, TypeScript e ferramentas modernas
- Experiência com testes automatizados
- Conhecimento de padrões de design e arquitetura
- Inglês intermediário/avançado`,
    status: "publicada",
    priority: "alta",
    formTemplateId: "1",
    isArchived: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    title: "Designer UX/UI",
    areaId: "3",
    level: "pleno",
    contractType: "clt",
    location: "Rio de Janeiro, RJ",
    isRemote: true,
    description: `Buscamos um Designer UX/UI apaixonado por criar experiências incríveis para nossos usuários.

**O que você vai fazer:**
- Criar wireframes, protótipos e interfaces finais
- Conduzir pesquisas com usuários
- Colaborar com times de produto e desenvolvimento
- Manter e evoluir nosso design system`,
    requirements: `- 3+ anos de experiência com design de produtos digitais
- Domínio de Figma e ferramentas de prototipagem
- Portfólio com cases relevantes
- Conhecimento de metodologias de pesquisa`,
    status: "publicada",
    priority: "media",
    formTemplateId: "1",
    isArchived: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "3",
    title: "Gerente Comercial",
    areaId: "2",
    level: "gerente",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: false,
    description: `Gerente para liderar equipe comercial e impulsionar resultados de vendas.

**Responsabilidades:**
- Gerenciar time de vendas
- Definir estratégias comerciais
- Acompanhar métricas e KPIs
- Desenvolver novos negócios`,
    requirements: `- 5+ anos de experiência em vendas B2B
- Experiência com gestão de equipes
- Forte orientação para resultados
- Conhecimento do mercado de tecnologia`,
    status: "publicada",
    priority: "urgente",
    isArchived: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    title: "Analista de Marketing Digital",
    areaId: "4",
    level: "pleno",
    contractType: "pj",
    location: "Remoto",
    isRemote: true,
    description: `Analista para campanhas digitais e estratégias de growth.

**Atividades:**
- Planejar e executar campanhas de mídia paga
- Análise de métricas e performance
- Criação de conteúdo para redes sociais
- Automação de marketing`,
    requirements: `- 2+ anos de experiência com marketing digital
- Conhecimento de Google Ads e Meta Ads
- Experiência com ferramentas de automação
- Perfil analítico e orientado a dados`,
    status: "pausada",
    priority: "baixa",
    isArchived: false,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "5",
    title: "Desenvolvedor Backend Pleno",
    areaId: "1",
    level: "pleno",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: true,
    description: `Desenvolvedor backend para APIs e sistemas distribuídos.`,
    requirements: `- 3+ anos de experiência com desenvolvimento backend
- Conhecimento de Node.js ou Python
- Experiência com bancos de dados SQL e NoSQL`,
    status: "encerrada",
    priority: "media",
    isArchived: false,
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2023-12-20"),
  },
  {
    id: "6",
    title: "Estagiário de RH",
    areaId: "5",
    level: "estagio",
    contractType: "estagio",
    location: "São Paulo, SP",
    isRemote: false,
    description: `Estágio em recrutamento e seleção para estudantes de Psicologia, Administração ou áreas correlatas.`,
    requirements: `- Cursando ensino superior
- Interesse por área de RH
- Boa comunicação`,
    status: "rascunho",
    priority: "baixa",
    isArchived: false,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
];

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

  // Sync with other tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setJobs(loadFromStorage());
      }
    };

    const handleCustomEvent = () => {
      setJobs(loadFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
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
