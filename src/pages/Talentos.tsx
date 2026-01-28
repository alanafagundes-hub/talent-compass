import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  Linkedin,
  MoreHorizontal,
  ExternalLink,
  Briefcase,
  Archive,
  Tag,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useTalentPool, type TalentPoolCandidate } from "@/hooks/useTalentPool";
import AvailabilityBadge from "@/components/talent/AvailabilityBadge";
import AvailabilitySelect from "@/components/talent/AvailabilitySelect";
import FitCulturalBadge from "@/components/talent/FitCulturalBadge";
import CandidateHistoryTimeline from "@/components/talent/CandidateHistoryTimeline";
import LinkToJobDialog from "@/components/talent/LinkToJobDialog";
import type { CandidateAvailability, Tag as TagType } from "@/types/ats";

export default function Talentos() {
  const { 
    candidates, 
    tags, 
    isLoading, 
    updateAvailability, 
    archiveCandidate,
    linkToJob 
  } = useTalentPool();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  
  // Detail sheet state
  const [selectedCandidate, setSelectedCandidate] = useState<TalentPoolCandidate | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Link to job dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkingCandidate, setLinkingCandidate] = useState<TalentPoolCandidate | null>(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability =
        availabilityFilter === "all" || 
        candidate.availability === availabilityFilter;
      
      const matchesTag =
        tagFilter === "all" ||
        candidate.tags.some((t) => t.id === tagFilter);
      
      return matchesSearch && matchesAvailability && matchesTag;
    });
  }, [candidates, searchTerm, availabilityFilter, tagFilter]);

  const handleViewDetails = (candidate: TalentPoolCandidate) => {
    setSelectedCandidate(candidate);
    setIsSheetOpen(true);
  };

  const handleLinkToJob = (candidate: TalentPoolCandidate) => {
    setLinkingCandidate(candidate);
    setLinkDialogOpen(true);
  };

  const handleArchive = async (candidate: TalentPoolCandidate) => {
    const success = await archiveCandidate(candidate.id);
    if (success) {
      toast.success(`${candidate.name} arquivado com sucesso`);
    } else {
      toast.error("Erro ao arquivar candidato");
    }
  };

  const handleAvailabilityChange = async (
    candidateId: string, 
    availability: CandidateAvailability
  ) => {
    const success = await updateAvailability(candidateId, availability);
    if (success) {
      toast.success("Disponibilidade atualizada");
      // Update selected candidate if it's the one being updated
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(prev => prev ? { ...prev, availability } : null);
      }
    } else {
      toast.error("Erro ao atualizar disponibilidade");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banco de Talentos</h1>
          <p className="text-muted-foreground">
            {candidates.length} candidatos no banco de talentos
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {/* Availability Filter */}
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Disponibilidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas disponibilidades</SelectItem>
              <SelectItem value="actively_seeking">🔥 Ativamente buscando</SelectItem>
              <SelectItem value="open_to_opportunities">🙂 Aberto a oportunidades</SelectItem>
              <SelectItem value="not_interested">❄️ Sem interesse</SelectItem>
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-[180px]">
              <Tag className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Etiqueta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas etiquetas</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2.5 w-2.5 rounded-full" 
                      style={{ backgroundColor: tag.color }} 
                    />
                    {tag.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Candidates List */}
      <div className="grid gap-4">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
            onClick={() => handleViewDetails(candidate)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{candidate.name}</h3>
                        {candidate.fitCultural && (
                          <FitCulturalBadge rating={candidate.fitCultural} size="sm" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[200px]">{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                        {candidate.linkedinUrl && (
                          <a
                            href={candidate.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                            <span>LinkedIn</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {candidate.availability && (
                        <AvailabilityBadge 
                          availability={candidate.availability} 
                        />
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(candidate)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLinkToJob(candidate)}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            Vincular a vaga
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleArchive(candidate)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {candidate.tags.slice(0, 5).map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${tag.color}15`,
                          color: tag.color,
                          borderColor: `${tag.color}40`,
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {candidate.tags.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{candidate.tags.length - 5}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>
                      {candidate.appliedJobsCount} vaga(s) aplicada(s)
                    </span>
                    <span>•</span>
                    <span>
                      Última atividade:{" "}
                      {new Date(candidate.lastActivity).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Nenhum candidato encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou aguarde novos candidatos.
            </p>
          </div>
        )}
      </div>

      {/* Candidate Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedCandidate && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedCandidate.name}
                  {selectedCandidate.fitCultural && (
                    <FitCulturalBadge rating={selectedCandidate.fitCultural} />
                  )}
                </SheetTitle>
                <SheetDescription>
                  {selectedCandidate.email}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Availability */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disponibilidade</label>
                  <AvailabilitySelect
                    value={selectedCandidate.availability || 'open_to_opportunities'}
                    onValueChange={(value) => 
                      handleAvailabilityChange(selectedCandidate.id, value)
                    }
                  />
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contato</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCandidate.email}</span>
                    </div>
                    {selectedCandidate.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCandidate.phone}</span>
                      </div>
                    )}
                    {selectedCandidate.linkedinUrl && (
                      <a
                        href={selectedCandidate.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Linkedin className="h-4 w-4" />
                        Ver LinkedIn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {selectedCandidate.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.tags.map((tag) => (
                        <Badge 
                          key={tag.id}
                          variant="outline"
                          style={{ 
                            backgroundColor: `${tag.color}15`,
                            color: tag.color,
                            borderColor: `${tag.color}40`,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* History Timeline */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Histórico de Candidaturas</h4>
                  <CandidateHistoryTimeline 
                    jobsHistory={selectedCandidate.jobsHistory} 
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setLinkingCandidate(selectedCandidate);
                      setLinkDialogOpen(true);
                    }}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Vincular a Vaga
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      handleArchive(selectedCandidate);
                      setIsSheetOpen(false);
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Arquivar
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Link to Job Dialog */}
      {linkingCandidate && (
        <LinkToJobDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          candidateName={linkingCandidate.name}
          candidateId={linkingCandidate.id}
          excludeJobIds={linkingCandidate.jobsHistory.map(j => j.jobId)}
          onConfirm={(jobId) => linkToJob(linkingCandidate.id, jobId)}
        />
      )}
    </div>
  );
}
