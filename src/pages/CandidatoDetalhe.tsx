import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  FileText,
  Download,
  Eye,
  Star,
  Clock,
  MoveRight,
  UserX,
  UserPlus,
  Send,
  MessageSquare,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import MarkAsLostDialog from "@/components/funnel/MarkAsLostDialog";
import RateStageDialog from "@/components/funnel/RateStageDialog";
import type { 
  Job, 
  FunnelStep, 
  Candidate, 
  Tag, 
  Area, 
  CardHistory, 
  CardStageHistory, 
  CardStageRating,
  LostCandidate 
} from "@/types/ats";
import { defaultFunnelStages, jobLevelLabels, contractTypeLabels } from "@/types/ats";
import { toast } from "sonner";

// Mock data - would come from context/state management in real app
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

const mockCandidates: Record<string, Candidate> = {
  "c1": { id: "c1", name: "João Silva", email: "joao@email.com", phone: "(11) 99999-1111", linkedinUrl: "https://linkedin.com/in/joao", resumeUrl: "/resumes/joao-silva.pdf", status: "ativo", tags: ["1"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "c2": { id: "c2", name: "Maria Santos", email: "maria@email.com", phone: "(11) 99999-2222", resumeUrl: "/resumes/maria-santos.pdf", status: "ativo", tags: ["2", "3"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "c3": { id: "c3", name: "Pedro Oliveira", email: "pedro@email.com", phone: "(11) 99999-3333", status: "ativo", tags: [], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "c4": { id: "c4", name: "Ana Costa", email: "ana@email.com", phone: "(11) 99999-4444", linkedinUrl: "https://linkedin.com/in/ana", resumeUrl: "/resumes/ana-costa.pdf", status: "ativo", tags: ["1"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "c5": { id: "c5", name: "Carlos Ferreira", email: "carlos@email.com", phone: "(11) 99999-5555", status: "ativo", tags: [], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "c6": { id: "c6", name: "Juliana Lima", email: "juliana@email.com", phone: "(11) 99999-6666", resumeUrl: "/resumes/juliana-lima.pdf", status: "ativo", tags: ["3"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "c7": { id: "c7", name: "Rafael Souza", email: "rafael@email.com", phone: "(11) 99999-7777", status: "ativo", tags: [], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "c8": { id: "c8", name: "Fernanda Alves", email: "fernanda@email.com", phone: "(11) 99999-8888", linkedinUrl: "https://linkedin.com/in/fernanda", status: "ativo", tags: ["2"], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
};

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

// Mock card data
const mockCards: Record<string, { candidateId: string; stepId: string; rating?: number; notes?: string; appliedAt: Date; sourceName?: string }> = {
  "card-1-1": { candidateId: "c1", stepId: "1-step-1", rating: 4, notes: "Ótimo perfil técnico", appliedAt: new Date("2024-01-15"), sourceName: "LinkedIn" },
  "card-1-2": { candidateId: "c2", stepId: "1-step-1", rating: 3, appliedAt: new Date("2024-01-16"), sourceName: "Site" },
  "card-1-3": { candidateId: "c3", stepId: "1-step-2", rating: 5, notes: "Destaque", appliedAt: new Date("2024-01-14"), sourceName: "Indicação" },
  "card-1-4": { candidateId: "c4", stepId: "1-step-2", appliedAt: new Date("2024-01-17"), sourceName: "Indeed" },
  "card-1-5": { candidateId: "c5", stepId: "1-step-3", rating: 4, appliedAt: new Date("2024-01-12") },
  "card-1-6": { candidateId: "c6", stepId: "1-step-4", rating: 5, appliedAt: new Date("2024-01-10"), sourceName: "LinkedIn" },
  "card-1-7": { candidateId: "c7", stepId: "1-step-5", appliedAt: new Date("2024-01-08") },
  "card-1-8": { candidateId: "c8", stepId: "1-step-6", rating: 4, appliedAt: new Date("2024-01-05"), sourceName: "Indicação" },
};

// Mock history
const generateMockHistory = (cardId: string, steps: FunnelStep[]): CardHistory[] => {
  const histories: CardHistory[] = [
    {
      id: `h-${cardId}-1`,
      cardId,
      toStepId: steps[0].id,
      toStepName: steps[0].name,
      action: "applied",
      notes: "Candidatura recebida via LinkedIn",
      createdBy: "sistema",
      createdAt: new Date("2024-01-15T10:30:00"),
    },
    {
      id: `h-${cardId}-2`,
      cardId,
      fromStepId: steps[0].id,
      fromStepName: steps[0].name,
      toStepId: steps[1].id,
      toStepName: steps[1].name,
      action: "moved",
      notes: "Movido para Triagem RH após análise inicial",
      createdBy: "admin",
      createdAt: new Date("2024-01-16T14:15:00"),
    },
    {
      id: `h-${cardId}-3`,
      cardId,
      fromStepId: steps[1].id,
      fromStepName: steps[1].name,
      toStepId: steps[1].id,
      toStepName: steps[1].name,
      action: "rating_changed",
      notes: "Avaliação: 4/5 - Excelente comunicação",
      createdBy: "admin",
      createdAt: new Date("2024-01-17T09:00:00"),
    },
    {
      id: `h-${cardId}-4`,
      cardId,
      fromStepId: steps[1].id,
      fromStepName: steps[1].name,
      toStepId: steps[1].id,
      toStepName: steps[1].name,
      action: "note_added",
      notes: "Candidato demonstrou interesse em projetos React",
      createdBy: "recrutador",
      createdAt: new Date("2024-01-18T11:30:00"),
    },
  ];
  return histories;
};

// Mock comments/notes
interface CandidateNote {
  id: string;
  cardId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

const generateMockNotes = (cardId: string): CandidateNote[] => [
  {
    id: `note-${cardId}-1`,
    cardId,
    content: "Candidato possui experiência sólida em React e TypeScript. Demonstrou boa comunicação durante contato inicial.",
    createdBy: "Maria (RH)",
    createdAt: new Date("2024-01-16T15:30:00"),
  },
  {
    id: `note-${cardId}-2`,
    cardId,
    content: "Agendada entrevista técnica para próxima semana. Candidato confirmou disponibilidade.",
    createdBy: "João (Tech Lead)",
    createdAt: new Date("2024-01-17T10:00:00"),
  },
];

export default function CandidatoDetalhe() {
  const { jobId, cardId } = useParams<{ jobId: string; cardId: string }>();
  const navigate = useNavigate();

  // Get data
  const job = mockJobs.find((j) => j.id === jobId);
  const area = mockAreas.find((a) => a.id === job?.areaId);
  const cardData = cardId ? mockCards[cardId] : null;
  const candidate = cardData ? mockCandidates[cardData.candidateId] : null;
  const steps = useMemo(() => generateInitialSteps(jobId || "1"), [jobId]);
  const currentStep = steps.find(s => s.id === cardData?.stepId);

  // State
  const [currentStepId, setCurrentStepId] = useState(cardData?.stepId || steps[0].id);
  const [rating, setRating] = useState(cardData?.rating || 0);
  const [history, setHistory] = useState<CardHistory[]>(() => 
    generateMockHistory(cardId || "", steps)
  );
  const [notes, setNotes] = useState<CandidateNote[]>(() => 
    generateMockNotes(cardId || "")
  );
  const [newNote, setNewNote] = useState("");
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);

  const actualCurrentStep = steps.find(s => s.id === currentStepId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getActionLabel = (action: CardHistory["action"]) => {
    const labels: Record<CardHistory["action"], string> = {
      applied: "Candidatura Recebida",
      moved: "Movido de Etapa",
      marked_as_lost: "Marcado como Incompatível",
      hired: "Contratado",
      note_added: "Anotação Adicionada",
      rating_changed: "Avaliação Registrada",
    };
    return labels[action];
  };

  const getActionColor = (action: CardHistory["action"]) => {
    const colors: Record<CardHistory["action"], string> = {
      applied: "bg-blue-500",
      moved: "bg-purple-500",
      marked_as_lost: "bg-red-500",
      hired: "bg-green-500",
      note_added: "bg-yellow-500",
      rating_changed: "bg-orange-500",
    };
    return colors[action];
  };

  const handleMoveStage = (newStepId: string) => {
    const fromStep = steps.find(s => s.id === currentStepId);
    const toStep = steps.find(s => s.id === newStepId);
    
    if (!fromStep || !toStep || fromStep.id === toStep.id) return;

    const now = new Date();
    const newHistory: CardHistory = {
      id: `h-${Date.now()}`,
      cardId: cardId!,
      fromStepId: fromStep.id,
      fromStepName: fromStep.name,
      toStepId: toStep.id,
      toStepName: toStep.name,
      action: "moved",
      notes: `Movido de "${fromStep.name}" para "${toStep.name}"`,
      createdBy: "admin",
      createdAt: now,
    };

    setHistory(prev => [newHistory, ...prev]);
    setCurrentStepId(newStepId);
    toast.success(`Candidato movido para ${toStep.name}`);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const now = new Date();
    const note: CandidateNote = {
      id: `note-${Date.now()}`,
      cardId: cardId!,
      content: newNote.trim(),
      createdBy: "admin",
      createdAt: now,
    };

    const historyEntry: CardHistory = {
      id: `h-${Date.now()}`,
      cardId: cardId!,
      fromStepId: currentStepId,
      fromStepName: actualCurrentStep?.name,
      toStepId: currentStepId,
      toStepName: actualCurrentStep?.name,
      action: "note_added",
      notes: newNote.trim(),
      createdBy: "admin",
      createdAt: now,
    };

    setNotes(prev => [note, ...prev]);
    setHistory(prev => [historyEntry, ...prev]);
    setNewNote("");
    toast.success("Anotação adicionada");
  };

  const handleConfirmLost = (data: any) => {
    toast.success(`${candidate?.name} marcado como incompatível`);
    setLostDialogOpen(false);
    navigate(`/vagas/${jobId}/funil`);
  };

  const handleSaveRating = (newRating: number, ratingNotes: string) => {
    const now = new Date();
    const historyEntry: CardHistory = {
      id: `h-${Date.now()}`,
      cardId: cardId!,
      fromStepId: currentStepId,
      fromStepName: actualCurrentStep?.name,
      toStepId: currentStepId,
      toStepName: actualCurrentStep?.name,
      action: "rating_changed",
      notes: `Avaliação: ${newRating}/5${ratingNotes ? ` - ${ratingNotes}` : ""}`,
      createdBy: "admin",
      createdAt: now,
    };

    setRating(newRating);
    setHistory(prev => [historyEntry, ...prev]);
    setRatingDialogOpen(false);
    toast.success("Avaliação registrada");
  };

  const handleSendToTalentBank = () => {
    toast.success(`${candidate?.name} enviado para o Banco de Talentos`);
    navigate(`/vagas/${jobId}/funil`);
  };

  if (!job || !cardData || !candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Candidato não encontrado</p>
        <Button variant="link" onClick={() => navigate(`/vagas/${jobId}/funil`)}>
          Voltar para o Funil
        </Button>
      </div>
    );
  }

  const candidateTags = candidate.tags
    .map(tagId => mockTags.find(t => t.id === tagId))
    .filter(Boolean) as Tag[];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/vagas/${jobId}/funil`)}
          className="shrink-0 mt-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{job.title}</span>
            <ChevronRight className="h-3 w-3" />
            <span>Candidato</span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials(candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{candidate.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  style={{ backgroundColor: actualCurrentStep?.color }} 
                  className="text-white"
                >
                  {actualCurrentStep?.name}
                </Badge>
                {candidateTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados do Candidato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <a href={`mailto:${candidate.email}`} className="text-sm hover:underline">
                      {candidate.email}
                    </a>
                  </div>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <a href={`tel:${candidate.phone}`} className="text-sm hover:underline">
                        {candidate.phone}
                      </a>
                    </div>
                  </div>
                )}
                {candidate.linkedinUrl && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">LinkedIn</p>
                      <a 
                        href={candidate.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm hover:underline flex items-center gap-1"
                      >
                        Ver Perfil
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data da Candidatura</p>
                    <p className="text-sm">{formatDateShort(cardData.appliedAt)}</p>
                  </div>
                </div>
              </div>

              {cardData.sourceName && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">Fonte da Candidatura</p>
                  <Badge variant="outline">{cardData.sourceName}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Currículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.resumeUrl ? (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Currículo - {candidate.name}</p>
                      <p className="text-xs text-muted-foreground">PDF • Enviado em {formatDateShort(cardData.appliedAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Baixar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum currículo anexado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Anotações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Adicionar uma anotação sobre o candidato..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </div>

              <Separator />

              <ScrollArea className="h-[300px] pr-4">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma anotação ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">{note.createdBy}</span>
                          <span>•</span>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* History Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Movimentações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {history.map((entry) => (
                      <div key={entry.id} className="flex gap-4 relative">
                        <div className={`w-6 h-6 rounded-full ${getActionColor(entry.action)} flex items-center justify-center shrink-0 z-10`}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{getActionLabel(entry.action)}</span>
                            {entry.action === "moved" && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>{entry.fromStepName}</span>
                                <MoveRight className="h-3 w-3" />
                                <span>{entry.toStepName}</span>
                              </div>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground">{entry.notes}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{entry.createdBy}</span>
                            <span>•</span>
                            <span>{formatDate(entry.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Rating Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Nota da Etapa
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold">{rating > 0 ? `${rating}/5` : "-"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Etapa: {actualCurrentStep?.name}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setRatingDialogOpen(true)}
              >
                {rating > 0 ? "Atualizar Avaliação" : "Avaliar Candidato"}
              </Button>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Move Stage */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mover para Etapa</label>
                <Select value={currentStepId} onValueChange={handleMoveStage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {steps.map((step) => (
                      <SelectItem key={step.id} value={step.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: step.color }}
                          />
                          {step.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Mark as Lost */}
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => setLostDialogOpen(true)}
              >
                <UserX className="h-4 w-4" />
                Marcar como Incompatível
              </Button>

              {/* Send to Talent Bank */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Enviar para Banco de Talentos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Enviar para Banco de Talentos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O candidato será removido desta vaga e adicionado ao Banco de Talentos 
                      para futuras oportunidades. Esta ação pode ser revertida.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSendToTalentBank}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Job Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vaga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{job.title}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{area?.name}</Badge>
                <Badge variant="outline">{jobLevelLabels[job.level]}</Badge>
                <Badge variant="outline">{contractTypeLabels[job.contractType]}</Badge>
              </div>
              <Button 
                variant="link" 
                className="px-0 h-auto text-sm"
                onClick={() => navigate(`/vagas/${jobId}/funil`)}
              >
                Ver funil completo →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lost Dialog */}
      <MarkAsLostDialog
        open={lostDialogOpen}
        onOpenChange={setLostDialogOpen}
        candidate={{
          id: candidate.id,
          cardId: cardId!,
          name: candidate.name,
          email: candidate.email,
          currentStepId: currentStepId,
          currentStepName: actualCurrentStep?.name || "Desconhecida",
          jobId: job.id,
          jobTitle: job.title,
          areaId: job.areaId,
          areaName: area?.name || "Desconhecida",
        }}
        onConfirm={handleConfirmLost}
      />

      {/* Rating Dialog */}
      <RateStageDialog
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        candidateName={candidate.name}
        stepName={actualCurrentStep?.name || ""}
        currentRating={rating}
        currentNotes=""
        onSave={handleSaveRating}
      />
    </div>
  );
}
