import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  Loader2,
  Sparkles,
  ChevronDown,
  Home,
} from "lucide-react";
import logoDot from "@/assets/logo-dot.png";
import { useLandingPageConfig, getIconComponent, defaultLandingPageConfig, type LandingPageConfig } from "@/hooks/useLandingPageConfig";
import { usePublicJobs, usePublicAreas } from "@/hooks/usePublicJobs";
import { cn } from "@/lib/utils";

// Job level labels
const jobLevelLabels: Record<string, string> = {
  estagio: "Estágio",
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
  coordenador: "Coordenador",
  gerente: "Gerente",
  diretor: "Diretor",
};

// Contract type labels
const contractTypeLabels: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  estagio: "Estágio",
  temporario: "Temporário",
  freelancer: "Freelancer",
};

export default function VagasPublicas() {
  const [searchParams] = useSearchParams();
  const { setTheme } = useTheme();
  const { config: savedConfig, isLoading: configLoading } = useLandingPageConfig();
  const { jobs, isLoading: jobsLoading } = usePublicJobs();
  const { areas, getAreaById, isLoading: areasLoading } = usePublicAreas();
  
  // Force dark mode on public pages - MANDATORY (no light mode allowed)
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);
  
  // Check for preview config in URL (used when previewing from settings)
  const previewConfig = searchParams.get("preview");
  const config: LandingPageConfig = previewConfig 
    ? { ...defaultLandingPageConfig, ...JSON.parse(decodeURIComponent(previewConfig)) }
    : savedConfig;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [workModelFilter, setWorkModelFilter] = useState<string>("all");
  const jobsSectionRef = useRef<HTMLDivElement>(null);

  const isLoading = jobsLoading || configLoading || areasLoading;

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === "all" || job.area_id === areaFilter;
    const matchesWorkModel = workModelFilter === "all" || job.work_model === workModelFilter;
    return matchesSearch && matchesArea && matchesWorkModel;
  });

  // Check if there are no jobs at all (not just filtered)
  const hasNoJobs = jobs.length === 0;
  // Check if no jobs after applying filters
  const hasNoFilteredJobs = filteredJobs.length === 0 && !hasNoJobs;
  // Check if any filter is active
  const hasActiveFilters = searchTerm !== "" || areaFilter !== "all" || workModelFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setAreaFilter("all");
    setWorkModelFilter("all");
  };

  // Generate dynamic styles based on config
  const primaryColorStyle = {
    "--lp-primary": config.primaryColor,
    "--lp-primary-light": `${config.primaryColor}20`,
    "--lp-primary-medium": `${config.primaryColor}40`,
    "--lp-secondary": config.secondaryColor,
  } as React.CSSProperties;

  // Style helpers based on controlled options
  const isContrasted = config.backgroundStyle === "dark-contrasted";
  const isBorderedCards = config.cardStyle === "bordered";
  const isCompactHero = config.heroStyle === "compact";

  // Card classes based on style
  const getCardClasses = (extraClasses?: string) => cn(
    "transition-all duration-300",
    isBorderedCards 
      ? "bg-transparent border border-border/50 backdrop-blur-sm" 
      : "bg-card/80 border-0 shadow-lg",
    extraClasses
  );

  // Section background based on style
  const getSectionBg = (isAlternate: boolean) => {
    if (!isContrasted) return "";
    return isAlternate ? "bg-muted/20" : "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const logoSrc = config.logoUrl || logoDot;

  return (
    <div className="min-h-screen bg-background dark" style={primaryColorStyle}>
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt={config.companyName} className="h-8 w-auto" />
            {config.companyName && config.logoUrl && (
              <span className="font-semibold text-lg">{config.companyName}</span>
            )}
          </div>
          <Button 
            onClick={scrollToJobs} 
            size="sm" 
            style={{ backgroundColor: config.secondaryColor }}
          >
            Ver Vagas
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={cn(
        "relative flex items-center justify-center overflow-hidden pt-16",
        isCompactHero ? "min-h-[60vh] py-16" : "min-h-[90vh]"
      )}>
        {/* Background gradient with dynamic color */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `linear-gradient(to bottom right, ${config.primaryColor}15, transparent, transparent)` 
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `radial-gradient(ellipse at top right, ${config.primaryColor}25, transparent 50%)` 
          }} 
        />
        
        {/* Decorative elements - only for prominent hero */}
        {!isCompactHero && (
          <>
            <div 
              className="absolute top-1/4 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse" 
              style={{ backgroundColor: `${config.primaryColor}15` }}
            />
            <div 
              className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse" 
              style={{ backgroundColor: `${config.primaryColor}10` }}
            />
          </>
        )}
        
        <div className={cn(
          "container max-w-5xl mx-auto px-4 text-center relative z-10",
          isCompactHero ? "py-12" : "py-20"
        )}>
          <Badge 
            variant="secondary" 
            className="mb-6 px-4 py-2 text-sm font-medium"
            style={{ borderColor: config.secondaryColor, color: config.secondaryColor }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Estamos contratando!
          </Badge>
          
          <h1 className={cn(
            "font-bold tracking-tight leading-tight",
            isCompactHero 
              ? "text-3xl sm:text-4xl md:text-5xl" 
              : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          )}>
            {config.heroHeadline.split(" ").slice(0, -2).join(" ")}
            <br />
            <span style={{ color: config.primaryColor }}>
              {config.heroHeadline.split(" ").slice(-2).join(" ")}
            </span>
          </h1>
          
          <p className={cn(
            "mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed",
            isCompactHero ? "text-base sm:text-lg" : "text-lg sm:text-xl"
          )}>
            {config.heroSubheadline}
          </p>
          
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center",
            isCompactHero ? "mt-8" : "mt-10"
          )}>
            <Button 
              size="lg" 
              onClick={config.heroCtaAction === "jobs" ? scrollToJobs : undefined}
              asChild={config.heroCtaAction === "talent-pool"}
              className={cn(
                "px-8 h-auto",
                isCompactHero ? "py-4 text-base" : "py-6 text-lg"
              )}
              style={{ backgroundColor: config.secondaryColor }}
            >
              {config.heroCtaAction === "talent-pool" ? (
                <Link to="/cadastro">
                  {config.heroCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  {config.heroCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className={cn(
                "px-8 h-auto",
                isCompactHero ? "py-4 text-base" : "py-6 text-lg"
              )}
              asChild
            >
              <a href="#about">Conheça a {config.companyName}</a>
            </Button>
          </div>
          
          {/* Scroll indicator - only for prominent hero */}
          {!isCompactHero && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section (Employer Branding) */}
      {config.showStatisticsSection && (config.statistics.length > 0 || jobs.length > 0) && (
        <section className={cn("py-20 relative overflow-hidden", getSectionBg(true))}>
          {/* Background */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(135deg, ${config.primaryColor}08, transparent 50%, ${config.primaryColor}05)` 
            }}
          />
          
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Nosso Impacto</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">
                {config.statisticsSectionTitle}
              </h2>
              {config.statisticsSectionSubtitle && (
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  {config.statisticsSectionSubtitle}
                </p>
              )}
            </div>
            
            {/* Build combined statistics: automatic "Vagas Abertas" + manual stats */}
            {(() => {
              // Automatic stat: only show if there are published jobs (never show 0)
              const autoJobsStat = jobs.length > 0 ? {
                id: "auto-vagas",
                title: "Vagas Abertas",
                value: jobs.length.toString(),
                description: "oportunidades disponíveis"
              } : null;
              
              // Combine: auto stat first (if exists), then manual stats
              const allStats = [
                ...(autoJobsStat ? [autoJobsStat] : []),
                ...config.statistics
              ];
              
              // Only render if there are stats to show
              if (allStats.length === 0) return null;
              
              return (
                <div className={`grid gap-6 ${
                  allStats.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                  allStats.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
                  allStats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {allStats.map((stat) => (
                    <Card 
                      key={stat.id}
                      className={cn(
                        getCardClasses("relative overflow-hidden text-center group hover:shadow-xl")
                      )}
                    >
                      {/* Accent line */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: config.primaryColor }}
                      />
                      
                      <CardContent className="p-8">
                        <p 
                          className="text-4xl sm:text-5xl font-bold tracking-tight mb-2"
                          style={{ color: config.primaryColor }}
                        >
                          {stat.value}
                        </p>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {stat.title}
                        </h3>
                        {stat.description && (
                          <p className="text-sm text-muted-foreground">
                            {stat.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* About/Culture Section */}
      <section id="about" className={cn("py-24", getSectionBg(false))}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Sobre nós</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              {config.aboutTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.aboutSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.values.map((value) => {
              const IconComponent = getIconComponent(value.icon);
              return (
                <Card 
                  key={value.id} 
                  className={cn(
                    getCardClasses("group hover:shadow-lg")
                  )}
                >
                  <CardContent className="p-6">
                    <div 
                      className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                      style={{ backgroundColor: `${config.primaryColor}15` }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: config.primaryColor }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section ref={jobsSectionRef} id="vagas" className={cn("py-24 scroll-mt-20", getSectionBg(true))}>
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Oportunidades</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              {config.jobsSectionTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              {config.jobsSectionSubtitle}
            </p>
          </div>

          {/* Filters - only show if there are jobs */}
          {!hasNoJobs && (
            <div className={cn(
              "flex flex-col gap-4 sm:flex-row sm:items-center mb-8 p-4 rounded-xl",
              isBorderedCards ? "border border-border/50" : "bg-muted/30"
            )}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as áreas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={workModelFilter} onValueChange={setWorkModelFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
                  <Home className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os modelos</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Empty State - No jobs at all (configurable) */}
          {hasNoJobs ? (
            <Card className={cn(getCardClasses("border-dashed"))}>
              <CardContent className="py-16 text-center">
                <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <h3 className="mt-6 text-xl font-semibold">{config.jobsEmptyTitle}</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  {config.jobsEmptySubtitle}
                </p>
                {config.showTalentPoolCta && (
                  <Button 
                    className="mt-6" 
                    style={{ backgroundColor: config.secondaryColor }}
                    asChild
                  >
                    <Link to="/cadastro">
                      {config.ctaButtonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : hasNoFilteredJobs ? (
            /* Empty State - No jobs matching filters */
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Search className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <h3 className="mt-6 text-xl font-semibold">Nenhuma vaga encontrada</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Não encontramos vagas com os filtros selecionados. 
                  Tente ajustar sua busca.
                </p>
                <Button variant="outline" className="mt-6" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-6">
                {filteredJobs.length} {filteredJobs.length === 1 ? "vaga disponível" : "vagas disponíveis"}
              </p>
              
              {filteredJobs.map((job) => {
                const area = job.area || getAreaById(job.area_id);
                return (
                  <Card 
                    key={job.id} 
                    className={cn(
                      getCardClasses("group overflow-hidden hover:shadow-xl hover:-translate-y-1")
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {area && (
                              <Badge variant="secondary" className="text-xs font-medium">
                                {area.name}
                              </Badge>
                            )}
                            {job.is_remote && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ borderColor: config.secondaryColor, color: config.secondaryColor }}
                              >
                                Remoto
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {jobLevelLabels[job.level] || job.level}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {contractTypeLabels[job.contract_type] || job.contract_type}
                            </span>
                          </div>
                          
                          {job.description && (
                            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                              {job.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <Button asChild style={{ backgroundColor: config.secondaryColor }}>
                            <Link to={`/vaga/${job.id}`}>
                              Ver Detalhes
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {config.showTalentPoolCta && (
        <section className={cn("py-24", getSectionBg(false))}>
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {config.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.ctaSubtitle}
            </p>
            <Button 
              size="lg" 
              className="mt-8 text-lg px-8 py-6 h-auto"
              style={{ backgroundColor: config.secondaryColor }}
              asChild
            >
              <Link to="/cadastro">
                {config.ctaButtonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt={config.companyName} className="h-6 w-auto" />
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {config.companyName}. Todos os direitos reservados.
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Desenvolvido com 💜 pelo time de R&S
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
