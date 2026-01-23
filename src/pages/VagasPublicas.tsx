import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
} from "lucide-react";
import type { Job } from "@/types/ats";
import { jobLevelLabels, contractTypeLabels } from "@/types/ats";
import logoDot from "@/assets/logo-dot.png";
import { useLandingPageConfig, getIconComponent, defaultLandingPageConfig, type LandingPageConfig } from "@/hooks/useLandingPageConfig";
import { useJobs } from "@/hooks/useJobs";
import { useAreas } from "@/hooks/useAreas";

export default function VagasPublicas() {
  const [searchParams] = useSearchParams();
  const { config: savedConfig, isLoading: configLoading } = useLandingPageConfig();
  const { getPublishedJobs, isLoading: jobsLoading } = useJobs();
  const { areas, getAreaById, isLoading: areasLoading } = useAreas();
  
  // Check for preview config in URL (used when previewing from settings)
  const previewConfig = searchParams.get("preview");
  const config: LandingPageConfig = previewConfig 
    ? { ...defaultLandingPageConfig, ...JSON.parse(decodeURIComponent(previewConfig)) }
    : savedConfig;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const jobsSectionRef = useRef<HTMLDivElement>(null);

  // Real-time sync: jobs are derived directly from the hook (single source of truth)
  // No artificial delay - updates happen instantly when ATS data changes
  const jobs = getPublishedJobs();
  const isLoading = jobsLoading || configLoading || areasLoading;

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === "all" || job.areaId === areaFilter;
    return matchesSearch && matchesArea;
  });

  // Generate dynamic primary color styles
  const primaryColorStyle = {
    "--lp-primary": config.primaryColor,
    "--lp-primary-light": `${config.primaryColor}20`,
    "--lp-primary-medium": `${config.primaryColor}40`,
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const logoSrc = config.logoUrl || logoDot;

  return (
    <div className="min-h-screen bg-background" style={primaryColorStyle}>
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt={config.companyName} className="h-8 w-auto" />
            {config.companyName && config.logoUrl && (
              <span className="font-semibold text-lg">{config.companyName}</span>
            )}
          </div>
          <Button onClick={scrollToJobs} size="sm" style={{ backgroundColor: config.primaryColor }}>
            Ver Vagas
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
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
        
        {/* Decorative elements */}
        <div 
          className="absolute top-1/4 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse" 
          style={{ backgroundColor: `${config.primaryColor}15` }}
        />
        <div 
          className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse" 
          style={{ backgroundColor: `${config.primaryColor}10` }}
        />
        
        <div className="container max-w-5xl mx-auto px-4 py-20 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 mr-2" />
            Estamos contratando!
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            {config.heroHeadline.split(" ").slice(0, -2).join(" ")}
            <br />
            <span style={{ color: config.primaryColor }}>
              {config.heroHeadline.split(" ").slice(-2).join(" ")}
            </span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {config.heroSubheadline}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={scrollToJobs} 
              className="text-lg px-8 py-6 h-auto"
              style={{ backgroundColor: config.primaryColor }}
            >
              {config.heroCta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto" asChild>
              <a href="#about">Conheça a {config.companyName}</a>
            </Button>
          </div>
          
          {/* Stats */}
          {config.showStats && (
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: config.primaryColor }}>
                  {config.stats.jobs}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Vagas Abertas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: config.primaryColor }}>
                  {config.stats.hired}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Contratados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: config.primaryColor }}>
                  {config.stats.areas}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Áreas</p>
              </div>
            </div>
          )}
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Statistics Section (Employer Branding) */}
      {config.showStatisticsSection && config.statistics.length > 0 && (
        <section className="py-20 relative overflow-hidden">
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
            
            <div className={`grid gap-6 ${
              config.statistics.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              config.statistics.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
              config.statistics.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {config.statistics.map((stat) => (
                <Card 
                  key={stat.id}
                  className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm text-center group hover:shadow-xl transition-all duration-300"
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
          </div>
        </section>
      )}

      {/* About/Culture Section */}
      <section id="about" className="py-24 bg-muted/30">
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
                  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                  style={{ 
                    ["--hover-border-color" as string]: `${config.primaryColor}50`,
                  }}
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
      <section ref={jobsSectionRef} id="vagas" className="py-24 scroll-mt-20">
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

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8 p-4 rounded-xl bg-muted/30 border border-border/50">
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
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {areas.filter(a => !a.isArchived).map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <h3 className="mt-6 text-xl font-semibold">Nenhuma vaga encontrada</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Não encontramos vagas com os filtros selecionados. 
                  Tente ajustar sua busca ou volte em breve.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => { setSearchTerm(""); setAreaFilter("all"); }}>
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
                const area = getAreaById(job.areaId);
                return (
                  <Card 
                    key={job.id} 
                    className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    style={{
                      ["--hover-shadow-color" as string]: `${config.primaryColor}10`,
                    }}
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
                            {job.isRemote && (
                              <Badge variant="outline" className="text-xs border-accent/50 text-accent">
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
                              {jobLevelLabels[job.level]}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {contractTypeLabels[job.contractType]}
                            </span>
                          </div>
                          
                          {job.description && (
                            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                              {job.description.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <Button 
                            asChild 
                            className="w-full lg:w-auto"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            <Link to={`/carreiras/${job.id}`}>
                              Candidatar-se
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
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, ${config.primaryColor}15, ${config.primaryColor}05)` 
          }}
        />
        
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {config.ctaTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {config.ctaSubtitle}
          </p>
          <Button 
            size="lg" 
            className="mt-8 text-lg px-8 py-6 h-auto"
            style={{ backgroundColor: config.primaryColor }}
            onClick={scrollToJobs}
          >
            {config.ctaButtonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt={config.companyName} className="h-6 w-auto opacity-70" />
              {config.companyName && (
                <span className="text-sm text-muted-foreground">{config.companyName}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {config.companyName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
