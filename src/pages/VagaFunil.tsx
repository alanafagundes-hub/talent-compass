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
  Loader2,
} from "lucide-react";
import KanbanBoard from "@/components/funnel/KanbanBoard";
import FunnelSettingsDialog from "@/components/funnel/FunnelSettingsDialog";
import MarkAsLostDialog from "@/components/funnel/MarkAsLostDialog";
import RateStageDialog from "@/components/funnel/RateStageDialog";
import CandidateDetailSheet from "@/components/funnel/CandidateDetailSheet";
import type { FunnelStep, CardHistory, CardStageHistory, LostCandidate, CardStageRating } from "@/types/ats";
import { jobLevelLabels, contractTypeLabels } from "@/types/ats";
import { toast } from "sonner";
import { useJobs } from "@/hooks/useJobs";
import { useAreas } from "@/hooks/useAreas";
import { useFunnelData, type KanbanCardData } from "@/hooks/useFunnelData";

export default function VagaFunil() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // Fetch real data from Supabase
  const { jobs } = useJobs();
  const { getAreaById } = useAreas();
  const { 
    steps, 
    cards, 
    tags, 
    isLoading, 
    error, 
    moveCard, 
    saveRating, 
    markAsLost, 
    saveSteps,
    setCards 
  } = useFunnelData(jobId);

  const job = jobs.find((j) => j.id === jobId);
  const area = job ? getAreaById(job.areaId) : undefined;

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
  
  // Rating dialog state
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedCardForRating, setSelectedCardForRating] = useState<{
    cardId: string;
    candidateName: string;
    stepId: string;
    stepName: string;
    currentRating?: number;
    currentNotes?: string;
  } | null>(null);
  const [stageRatings, setStageRatings] = useState<CardStageRating[]>([]);

  // Candidate detail sheet state
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<KanbanCardData | null>(null);

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

  const handleCardMove = async (cardId: string, fromStepId: string, toStepId: string) => {
    const now = new Date();
    const fromStep = steps.find(s => s.id === fromStepId);
    const toStep = steps.find(s => s.id === toStepId);

    // Optimistic update - update local state immediately
    setCards(prev => 
      prev.map(c => 
        c.id === cardId 
          ? { ...c, stepId: toStepId, enteredAt: now } 
          : c
      )
    );

    // Determine exit reason based on direction
    const fromOrder = fromStep?.order || 0;
    const toOrder = toStep?.order || 0;
    const exitReason: 'advanced' | 'moved_back' = toOrder > fromOrder ? 'advanced' : 'moved_back';

    // Update stage history locally
    setStageHistory(prev => {
      const updated = prev.map(h => 
        h.cardId === cardId && h.stepId === fromStepId && !h.exitedAt
          ? { 
              ...h, 
              exitedAt: now, 
              duration: Math.floor((now.getTime() - h.enteredAt.getTime()) / 60000),
              exitReason,
            }
          : h
      );
      
      updated.push({
        id: `sh-${Date.now()}`,
        cardId,
        stepId: toStepId,
        stepName: toStep?.name || 'Desconhecida',
        stepOrder: toStep?.order || 0,
        enteredAt: now,
      });
      
      return updated;
    });

    // Add to local history
    setHistory(prev => [...prev, {
      id: `h-${Date.now()}`,
      cardId,
      fromStepId,
      fromStepName: fromStep?.name,
      toStepId,
      toStepName: toStep?.name,
      action: "moved",
      notes: `Movido de "${fromStep?.name}" para "${toStep?.name}"`,
      createdBy: "admin",
      createdAt: now,
    }]);

    // Persist to database
    const success = await moveCard(cardId, fromStepId, toStepId);
    if (success) {
      toast.success(`Candidato movido para ${toStep?.name}`);
    } else {
      // Revert on error
      setCards(prev => 
        prev.map(c => 
          c.id === cardId 
            ? { ...c, stepId: fromStepId } 
            : c
        )
      );
      toast.error("Erro ao mover candidato");
    }
  };

  const handleSaveSteps = async (newSteps: FunnelStep[]) => {
    // Map old step IDs to new ones for cards that need updating
    const oldStepIds = steps.map(s => s.id);
    const newStepIds = newSteps.map(s => s.id);
    
    // Check if any cards are in deleted steps
    const deletedStepIds = oldStepIds.filter(id => !newStepIds.includes(id));
    const cardsInDeletedSteps = cards.filter(c => deletedStepIds.includes(c.stepId));
    
    if (cardsInDeletedSteps.length > 0) {
      // Move to first step locally
      setCards(prev => prev.map(c => 
        deletedStepIds.includes(c.stepId) 
          ? { ...c, stepId: newSteps[0].id } 
          : c
      ));
    }
    
    const success = await saveSteps(newSteps);
    if (success) {
      toast.success("Funil atualizado com sucesso");
    } else {
      toast.error("Erro ao salvar configurações do funil");
    }
  };

  const handleViewDetails = (card: KanbanCardData) => {
    setSelectedCardForDetail(card);
    setDetailSheetOpen(true);
  };

  const handleAdvanceStageFromSheet = () => {
    if (!selectedCardForDetail) return;
    
    const currentStepIndex = steps.findIndex((s) => s.id === selectedCardForDetail.stepId);
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      handleCardMove(selectedCardForDetail.id, selectedCardForDetail.stepId, nextStep.id);
      // Update the selected card's stepId
      setSelectedCardForDetail((prev) =>
        prev ? { ...prev, stepId: nextStep.id, enteredAt: new Date() } : null
      );
    }
  };

  const handleMarkAsLostFromSheet = () => {
    if (!selectedCardForDetail) return;
    handleMarkAsLost(selectedCardForDetail);
  };

  const handleRateFromSheet = () => {
    if (!selectedCardForDetail) return;
    handleRate(selectedCardForDetail);
  };

  const handleMarkAsLost = (card: KanbanCardData) => {
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

  const handleConfirmLost = async (data: {
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
    const card = cards.find(c => c.id === data.cardId);
    if (!card) return;

    // Optimistic update - remove from local state
    setCards(prev => prev.filter(c => c.id !== data.cardId));

    // Create lost candidate record locally
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

    setLostCandidates(prev => [...prev, lostRecord]);

    // Add to local history
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

    // Persist to database
    const success = await markAsLost(data.cardId, data.reasonId, data.observation);
    
    setLostDialogOpen(false);
    setSelectedCardForLost(null);

    if (success) {
      toast.success(`${card.candidate.name} marcado como incompatível`);
    } else {
      // Revert on error
      setCards(prev => [...prev, card]);
      toast.error("Erro ao marcar como incompatível");
    }
  };

  const handleRate = (card: KanbanCardData) => {
    const currentStep = steps.find(s => s.id === card.stepId);
    
    // Check if there's already a rating for this card in this step
    const existingRating = card.stageRatings?.find(
      r => r.stepId === card.stepId
    );
    
    setSelectedCardForRating({
      cardId: card.id,
      candidateName: card.candidate.name,
      stepId: card.stepId,
      stepName: currentStep?.name || "Desconhecida",
      currentRating: existingRating?.rating,
      currentNotes: existingRating?.notes,
    });
    setRatingDialogOpen(true);
  };

  const handleSaveRating = async (rating: number, notes: string) => {
    if (!selectedCardForRating) return;

    const now = new Date();
    const newRating: CardStageRating = {
      id: `sr-${Date.now()}`,
      cardId: selectedCardForRating.cardId,
      stepId: selectedCardForRating.stepId,
      stepName: selectedCardForRating.stepName,
      rating,
      notes: notes || undefined,
      evaluatedBy: 'admin',
      evaluatedAt: now,
    };

    // Optimistic update
    setStageRatings(prev => {
      const existing = prev.findIndex(
        r => r.cardId === selectedCardForRating.cardId && r.stepId === selectedCardForRating.stepId
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newRating;
        return updated;
      }
      return [...prev, newRating];
    });

    setCards(prev => prev.map(c => 
      c.id === selectedCardForRating.cardId 
        ? { ...c, rating } 
        : c
    ));

    // Add to local history
    setHistory(prev => [...prev, {
      id: `h-${Date.now()}`,
      cardId: selectedCardForRating.cardId,
      fromStepId: selectedCardForRating.stepId,
      fromStepName: selectedCardForRating.stepName,
      toStepId: selectedCardForRating.stepId,
      toStepName: selectedCardForRating.stepName,
      action: 'rating_changed',
      notes: `Avaliação: ${rating}/5${notes ? ` - ${notes}` : ''}`,
      createdBy: 'admin',
      createdAt: now,
    }]);

    // Persist to database
    const success = await saveRating(
      selectedCardForRating.cardId,
      selectedCardForRating.stepId,
      rating,
      notes
    );

    setRatingDialogOpen(false);
    setSelectedCardForRating(null);

    if (success) {
      toast.success(`Avaliação registrada para ${selectedCardForRating.candidateName}`);
    } else {
      toast.error("Erro ao salvar avaliação");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando funil...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-destructive">{error}</p>
        <Button variant="link" onClick={() => navigate("/vagas")}>
          Voltar para Vagas
        </Button>
      </div>
    );
  }

  // Job not found
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
              <span>{area?.name || 'Sem área'}</span>
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
            {tags.map((tag) => (
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
      {steps.length > 0 ? (
        <KanbanBoard
          steps={steps}
          cards={filteredCards}
          onCardMove={handleCardMove}
          onViewDetails={handleViewDetails}
          onMarkAsLost={handleMarkAsLost}
          onRate={handleRate}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-2">Funil não configurado para esta vaga</p>
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            Configurar Funil
          </Button>
        </div>
      )}

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

      {/* Rate Stage Dialog */}
      <RateStageDialog
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        candidateName={selectedCardForRating?.candidateName || ""}
        stepName={selectedCardForRating?.stepName || ""}
        currentRating={selectedCardForRating?.currentRating}
        currentNotes={selectedCardForRating?.currentNotes}
        onSave={handleSaveRating}
      />

      {/* Candidate Detail Sheet */}
      <CandidateDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        card={selectedCardForDetail}
        steps={steps}
        job={job}
        area={area}
        onMarkAsLost={handleMarkAsLostFromSheet}
        onAdvanceStage={handleAdvanceStageFromSheet}
        onRate={handleRateFromSheet}
      />
    </div>
  );
}
