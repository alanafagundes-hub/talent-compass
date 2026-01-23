import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Settings2,
  UserPlus,
  Search,
  Filter,
  ExternalLink,
  Users,
} from "lucide-react";
import KanbanBoard from "@/components/funnel/KanbanBoard";
import FunnelSettingsDialog from "@/components/funnel/FunnelSettingsDialog";
import MarkAsLostDialog from "@/components/funnel/MarkAsLostDialog";
import type { Job, FunnelStep, Candidate, Tag, Area, CardHistory, CardStageHistory, LostCandidate } from "@/types/ats";
import { defaultFunnelStages, jobLevelLabels, contractTypeLabels } from "@/types/ats";
import { toast } from "sonner";

// Mock data
const mockAreas: Area[] = [
  { id: "1", name: "Tech", description: "Desenvolvimento", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Comercial", description: "Vendas", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Criação", description: "Design", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
];

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Senior",
    areaId: "1",
    level: "senior",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: true,
    description: "Buscamos um desenvolvedor frontend senior.",
    status: "publicada",
    priority: "alta",
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
    description: "Designer para criar experiências.",
    status: "publicada",
    priority: "media",
    isArchived: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
];

const mockTags: Tag[] = [
  { id: "1", name: "Destaque", color: "#22c55e", isArchived: false, createdAt: new Date() },
  { id: "2", name: "Urgente", color: "#ef4444", isArchived: false, createdAt: new Date() },
  { id: "3", name: "Indicação", color: "#3b82f6", isArchived: false, createdAt: new Date() },
];

const mockCandidates: Candidate[] = [
  { id: "c1", name: "João Silva", email: "joao@email.com", phone: "(11) 99999-1111", linkedinUrl: "https://linkedin.com/in/joao", status: "ativo", tags: ["1"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "c2", name: "Maria Santos", email: "maria@email.com", phone: "(11) 99999-2222", status: "ativo", tags: ["2", "3"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "c3", name: "Pedro Oliveira", email: "pedro@email.com", phone: "(11) 99999-3333", status: "ativo", tags: [], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "c4", name: "Ana Costa", email: "ana@email.com", phone: "(11) 99999-4444", linkedinUrl: "https://linkedin.com/in/ana", status: "ativo", tags: ["1"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "c5", name: "Carlos Ferreira", email: "carlos@email.com", phone: "(11) 99999-5555", status: "ativo", tags: [], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "c6", name: "Juliana Lima", email: "juliana@email.com", phone: "(11) 99999-6666", status: "ativo", tags: ["3"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "c7", name: "Rafael Souza", email: "rafael@email.com", phone: "(11) 99999-7777", status: "ativo", tags: [], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "c8", name: "Fernanda Alves", email: "fernanda@email.com", phone: "(11) 99999-8888", status: "ativo", tags: ["2"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
];

// Generate initial funnel steps for a job
const generateInitialSteps = (jobId: string): FunnelStep[] => {
  return defaultFunnelStages.map((stage, index) => ({
    id: `${jobId}-step-${index + 1}`,
    jobId,
    name: stage.name,
    stage: "triagem" as const,
    order: stage.order,
    color: stage.color,
    isArchived: false,
    createdAt: new Date(),
  }));
};

// Generate initial cards distributed across steps
const generateInitialCards = (jobId: string, steps: FunnelStep[]) => {
  const distribution = [
    { candidateId: "c1", stepIndex: 0, rating: 4, notes: "Ótimo perfil" },
    { candidateId: "c2", stepIndex: 0, rating: 3 },
    { candidateId: "c3", stepIndex: 1, rating: 5, notes: "Destaque" },
    { candidateId: "c4", stepIndex: 1 },
    { candidateId: "c5", stepIndex: 2, rating: 4 },
    { candidateId: "c6", stepIndex: 3, rating: 5 },
    { candidateId: "c7", stepIndex: 4 },
    { candidateId: "c8", stepIndex: 5, rating: 4 },
  ];

  return distribution.map((d, idx) => {
    const candidate = mockCandidates.find(c => c.id === d.candidateId)!;
    const candidateTags = candidate.tags
      .map(tagId => mockTags.find(t => t.id === tagId))
      .filter(Boolean) as Tag[];

    return {
      id: `card-${jobId}-${idx + 1}`,
      candidate,
      stepId: steps[d.stepIndex].id,
      rating: d.rating,
      notes: d.notes,
      tags: candidateTags,
      enteredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    };
  });
};

export default function VagaFunil() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const job = mockJobs.find((j) => j.id === jobId);
  const area = mockAreas.find((a) => a.id === job?.areaId);

  const [steps, setSteps] = useState<FunnelStep[]>(() => 
    generateInitialSteps(jobId || "1")
  );
  
  const [cards, setCards] = useState(() => 
    generateInitialCards(jobId || "1", steps)
  );

  const [history, setHistory] = useState<CardHistory[]>([]);
  const [stageHistory, setStageHistory] = useState<CardStageHistory[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Lost candidate state
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [selectedCardForLost, setSelectedCardForLost] = useState<{
    id: string;
    cardId: string;
    name: string;
    email: string;
    currentStepId: string;
    currentStepName: string;
    jobId: string;
    jobTitle: string;
    areaId: string;
    areaName: string;
  } | null>(null);
  const [lostCandidates, setLostCandidates] = useState<LostCandidate[]>([]);

  // Calculate card count per step
  const cardCountByStep = useMemo(() => {
    return cards.reduce((acc, card) => {
      acc[card.stepId] = (acc[card.stepId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [cards]);

  // Filter cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch = card.candidate.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTag =
        tagFilter === "all" ||
        card.tags?.some((t) => t.id === tagFilter);
      return matchesSearch && matchesTag;
    });
  }, [cards, searchTerm, tagFilter]);

  const handleCardMove = (cardId: string, fromStepId: string, toStepId: string) => {
    const now = new Date();
    const fromStep = steps.find(s => s.id === fromStepId);
    const toStep = steps.find(s => s.id === toStepId);

    // Update stage history - close previous
    setStageHistory(prev => {
      const updated = prev.map(h => 
        h.cardId === cardId && h.stepId === fromStepId && !h.exitedAt
          ? { ...h, exitedAt: now, duration: Math.floor((now.getTime() - h.enteredAt.getTime()) / 60000) }
          : h
      );
      
      // Add new entry
      updated.push({
        id: `sh-${Date.now()}`,
        cardId,
        stepId: toStepId,
        enteredAt: now,
      });
      
      return updated;
    });

    // Add to card history
    setHistory(prev => [...prev, {
      id: `h-${Date.now()}`,
      cardId,
      fromStepId,
      toStepId,
      action: "moved",
      notes: `Movido de "${fromStep?.name}" para "${toStep?.name}"`,
      createdBy: "admin",
      createdAt: now,
    }]);

    // Update card
    setCards(prev => 
      prev.map(c => 
        c.id === cardId 
          ? { ...c, stepId: toStepId, enteredAt: now } 
          : c
      )
    );

    toast.success(`Candidato movido para ${toStep?.name}`);
  };

  const handleSaveSteps = (newSteps: FunnelStep[]) => {
    // Map old step IDs to new ones for cards that need updating
    const oldStepIds = steps.map(s => s.id);
    const newStepIds = newSteps.map(s => s.id);
    
    // Check if any cards are in deleted steps
    const deletedStepIds = oldStepIds.filter(id => !newStepIds.includes(id));
    const cardsInDeletedSteps = cards.filter(c => deletedStepIds.includes(c.stepId));
    
    if (cardsInDeletedSteps.length > 0) {
      // Move to first step
      setCards(prev => prev.map(c => 
        deletedStepIds.includes(c.stepId) 
          ? { ...c, stepId: newSteps[0].id } 
          : c
      ));
    }
    
    setSteps(newSteps);
  };

  const handleViewDetails = (card: any) => {
    toast.info(`Abrindo detalhes de ${card.candidate.name}`);
    // TODO: Open candidate details modal/page
  };

  const handleMarkAsLost = (card: any) => {
    const currentStep = steps.find(s => s.id === card.stepId);
    
    setSelectedCardForLost({
      id: card.candidate.id,
      cardId: card.id,
      name: card.candidate.name,
      email: card.candidate.email,
      currentStepId: card.stepId,
      currentStepName: currentStep?.name || "Desconhecida",
      jobId: job!.id,
      jobTitle: job!.title,
      areaId: job!.areaId,
      areaName: area?.name || "Desconhecida",
    });
    setLostDialogOpen(true);
  };

  const handleConfirmLost = (data: {
    candidateId: string;
    cardId: string;
    reasonId: string;
    reasonName: string;
    observation: string;
    stepId: string;
    stepName: string;
    jobId: string;
    jobTitle: string;
    areaId: string;
    areaName: string;
    lostAt: Date;
  }) => {
    // Get candidate info
    const card = cards.find(c => c.id === data.cardId);
    if (!card) return;

    // Create lost candidate record
    const lostRecord: LostCandidate = {
      id: `lost-${Date.now()}`,
      candidateId: data.candidateId,
      candidateName: card.candidate.name,
      candidateEmail: card.candidate.email,
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      areaId: data.areaId,
      areaName: data.areaName,
      cardId: data.cardId,
      stepId: data.stepId,
      stepName: data.stepName,
      reasonId: data.reasonId,
      reasonName: data.reasonName,
      observation: data.observation,
      canReapply: true,
      lostAt: data.lostAt,
      createdAt: new Date(),
    };

    // Add to lost candidates
    setLostCandidates(prev => [...prev, lostRecord]);

    // Add to history
    setHistory(prev => [...prev, {
      id: `h-${Date.now()}`,
      cardId: data.cardId,
      fromStepId: data.stepId,
      toStepId: "lost",
      action: "marked_as_lost",
      notes: `Marcado como incompatível: ${data.reasonName}${data.observation ? ` - ${data.observation}` : ""}`,
      createdBy: "admin",
      createdAt: data.lostAt,
    }]);

    // Remove card from kanban
    setCards(prev => prev.filter(c => c.id !== data.cardId));

    // Close dialog
    setLostDialogOpen(false);
    setSelectedCardForLost(null);

    toast.success(`${card.candidate.name} marcado como incompatível`);
  };

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Vaga não encontrada</p>
        <Button variant="link" onClick={() => navigate("/vagas")}>
          Voltar para Vagas
        </Button>
      </div>
    );
  }

  const totalCandidates = cards.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/vagas")}
            className="shrink-0 mt-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
              <Badge variant="outline" className="text-xs">
                {job.status === "publicada" ? "Publicada" : job.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
              <span>{area?.name}</span>
              <span>•</span>
              <span>{jobLevelLabels[job.level]}</span>
              <span>•</span>
              <span>{contractTypeLabels[job.contractType]}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{totalCandidates} candidatos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {job.status === "publicada" && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={`/carreiras/${job.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Ver Página
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings2 className="h-4 w-4" />
            Configurar Funil
          </Button>
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar Candidato
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar candidato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as tags</SelectItem>
            {mockTags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        steps={steps}
        cards={filteredCards}
        onCardMove={handleCardMove}
        onViewDetails={handleViewDetails}
        onMarkAsLost={handleMarkAsLost}
      />

      {/* Funnel Settings Dialog */}
      <FunnelSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        steps={steps}
        cardCountByStep={cardCountByStep}
        onSave={handleSaveSteps}
        jobId={job.id}
      />

      {/* Mark as Lost Dialog */}
      <MarkAsLostDialog
        open={lostDialogOpen}
        onOpenChange={setLostDialogOpen}
        candidate={selectedCardForLost}
        onConfirm={handleConfirmLost}
      />
    </div>
  );
}
