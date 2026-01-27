import { useState, useEffect } from "react";
import { Sparkles, Users, Heart, TrendingUp, Rocket, Target, Building2, Award, Star, Clock, Globe, Zap, CheckCircle, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ValueCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface StatisticItem {
  id: string;
  title: string;
  value: string;
  description?: string;
}

// Visual governance types
export type BackgroundStyle = "dark-default" | "dark-contrasted";
export type CardStyle = "solid" | "bordered";
export type HeroStyle = "compact" | "prominent";

// CTA action types
export type CtaAction = "jobs" | "talent-pool" | "culture";

// Section identifiers for ordering
export type SectionId = "statistics" | "culture" | "jobs" | "talent-pool-cta";

export interface SectionOrder {
  id: SectionId;
  enabled: boolean;
}

export interface LandingPageConfig {
  // Branding (controlled parameters)
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string; // For CTAs, links, badges only
  
  // Visual Style (controlled options)
  backgroundStyle: BackgroundStyle;
  cardStyle: CardStyle;
  heroStyle: HeroStyle;
  
  // Section ordering and visibility
  sectionOrder: SectionOrder[];
  
  // Header
  headerCtaText: string;
  
  // Hero Section (emotional/inspirational only)
  heroBadgeText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  heroCtaAction: CtaAction;
  heroSecondaryCta: string; // Secondary CTA text
  
  // Statistics Section (Employer Branding)
  showStatisticsSection: boolean;
  statisticsBadgeText: string;
  statisticsSectionTitle: string;
  statisticsSectionSubtitle: string;
  statistics: StatisticItem[];
  
  // About Section
  showCultureSection: boolean;
  cultureBadgeText: string;
  aboutTitle: string;
  aboutSubtitle: string;
  values: ValueCard[];
  // CTA after culture section (light invitation)
  showCultureCta: boolean;
  cultureCta: string;
  cultureCtaAction: CtaAction;
  
  // Jobs Section
  showJobsSection: boolean;
  jobsBadgeText: string;
  jobsSectionTitle: string;
  jobsSectionSubtitle: string;
  jobsEmptyTitle: string;
  jobsEmptySubtitle: string;
  // CTA for job cards (direct action)
  jobCardCta: string;
  
  // CTA Final (talent pool focus)
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  showTalentPoolCta: boolean;
  
  // Footer
  footerText: string;
}

export const defaultLandingPageConfig: LandingPageConfig = {
  // Branding
  companyName: "DOT",
  logoUrl: "",
  primaryColor: "#8B5CF6",
  secondaryColor: "#22C55E", // Green for CTAs
  
  // Visual Style
  backgroundStyle: "dark-default",
  cardStyle: "solid",
  heroStyle: "prominent",
  
  // Section ordering (default order)
  sectionOrder: [
    { id: "statistics", enabled: true },
    { id: "culture", enabled: true },
    { id: "jobs", enabled: true },
    { id: "talent-pool-cta", enabled: true },
  ],
  
  // Header
  headerCtaText: "Ver Vagas",
  
  // Hero (emotional/inspirational tone)
  heroBadgeText: "Estamos contratando!",
  heroHeadline: "Construa sua carreira com a gente",
  heroSubheadline: "Junte-se a uma equipe apaixonada por inovação e faça parte de projetos que transformam o mercado.",
  heroCta: "Explorar oportunidades",
  heroCtaAction: "jobs",
  heroSecondaryCta: "Conheça a empresa",
  
  // Statistics
  showStatisticsSection: true,
  statisticsBadgeText: "Nosso Impacto",
  statisticsSectionTitle: "Nossos Números",
  statisticsSectionSubtitle: "Resultados que refletem nossa dedicação e crescimento contínuo",
  statistics: [
    { id: "1", title: "Colaboradores", value: "+120", description: "em crescimento constante" },
    { id: "2", title: "Anos de Mercado", value: "8", description: "de experiência consolidada" },
    { id: "3", title: "Projetos Entregues", value: "500+", description: "com excelência" },
    { id: "4", title: "Satisfação", value: "95%", description: "dos nossos clientes" },
  ],
  
  // About (culture section with light invitation CTA)
  showCultureSection: true,
  cultureBadgeText: "Sobre nós",
  aboutTitle: "Por que trabalhar conosco?",
  aboutSubtitle: "Descubra o que faz da nossa empresa um ótimo lugar para crescer profissionalmente",
  values: [
    { id: "1", icon: "Sparkles", title: "Inovação Constante", description: "Trabalhamos com as tecnologias mais modernas do mercado e incentivamos a experimentação." },
    { id: "2", icon: "Users", title: "Cultura Colaborativa", description: "Valorizamos o trabalho em equipe e a troca de conhecimentos entre todos." },
    { id: "3", icon: "Heart", title: "Bem-estar em Primeiro Lugar", description: "Oferecemos benefícios que cuidam de você e da sua família." },
    { id: "4", icon: "TrendingUp", title: "Crescimento Acelerado", description: "Plano de carreira estruturado com oportunidades reais de evolução." },
  ],
  showCultureCta: true,
  cultureCta: "Quero fazer parte",
  cultureCtaAction: "jobs",
  
  // Jobs (direct action tone)
  showJobsSection: true,
  jobsBadgeText: "Oportunidades",
  jobsSectionTitle: "Vagas Abertas",
  jobsSectionSubtitle: "Encontre a oportunidade perfeita para o próximo passo da sua carreira",
  jobsEmptyTitle: "Em breve, novas oportunidades!",
  jobsEmptySubtitle: "No momento não temos vagas abertas, mas estamos sempre em busca de talentos. Cadastre-se em nosso banco de talentos para ser notificado.",
  jobCardCta: "Candidatar-se",
  
  // CTA Final (talent pool focus)
  ctaTitle: "Não encontrou a vaga ideal?",
  ctaSubtitle: "Cadastre-se em nosso banco de talentos e seja o primeiro a saber quando surgirem novas oportunidades na sua área.",
  ctaButtonText: "Entrar para o Banco de Talentos",
  showTalentPoolCta: true,
  
  // Footer
  footerText: "Desenvolvido com 💜 pelo time de R&S",
};

export const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Users,
  Heart,
  TrendingUp,
  Rocket,
  Target,
  Building2,
  Award,
  Star,
  Clock,
  Globe,
  Zap,
  CheckCircle,
  Trophy,
};

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Sparkles;
}

// Style presets for controlled options
export const backgroundStyleOptions = [
  { value: "dark-default" as const, label: "Dark padrão", description: "Fundo escuro uniforme" },
  { value: "dark-contrasted" as const, label: "Dark contrastado", description: "Seções alternadas com contraste" },
];

export const cardStyleOptions = [
  { value: "solid" as const, label: "Cards sólidos", description: "Fundo sólido sem borda" },
  { value: "bordered" as const, label: "Cards com borda", description: "Fundo transparente com borda" },
];

export const heroStyleOptions = [
  { value: "compact" as const, label: "Compacto", description: "Hero menor e direto" },
  { value: "prominent" as const, label: "Destacado", description: "Hero grande e impactante" },
];

export const primaryColorPresets = [
  { name: "Roxo", value: "#8B5CF6" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Índigo", value: "#6366F1" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Ciano", value: "#06B6D4" },
  { name: "Vermelho", value: "#EF4444" },
];

export const secondaryColorPresets = [
  { name: "Verde", value: "#22C55E" },
  { name: "Laranja", value: "#F97316" },
  { name: "Amarelo", value: "#EAB308" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Ciano", value: "#06B6D4" },
  { name: "Azul", value: "#3B82F6" },
];

export function useLandingPageConfig() {
  const [config, setConfig] = useState<LandingPageConfig>(() => {
    // Initialize from localStorage synchronously to avoid flash
    try {
      const saved = localStorage.getItem("landingPageConfig");
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeConfig(parsed);
      }
    } catch (error) {
      console.error("[LandingPageConfig] Error loading config:", error);
    }
    return defaultLandingPageConfig;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Deep merge function to properly merge nested objects and arrays
  function mergeConfig(saved: Partial<LandingPageConfig>): LandingPageConfig {
    return {
      ...defaultLandingPageConfig,
      ...saved,
      // Preserve arrays as-is from saved config (don't merge with defaults)
      values: saved.values ?? defaultLandingPageConfig.values,
      statistics: saved.statistics ?? defaultLandingPageConfig.statistics,
    };
  }

  useEffect(() => {
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "landingPageConfig" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig(mergeConfig(parsed));
        } catch (error) {
          console.error("Error parsing landing page config:", error);
        }
      }
    };

    // Listen for same-tab config updates
    const handleCustomEvent = (e: CustomEvent<LandingPageConfig>) => {
      setConfig(e.detail);
    };

    // Reload config when window gains focus (catches updates from other tabs/sessions)
    const handleFocus = () => {
      try {
        const saved = localStorage.getItem("landingPageConfig");
        if (saved) {
          const parsed = JSON.parse(saved);
          setConfig(mergeConfig(parsed));
        }
      } catch (error) {
        console.error("Error reloading landing page config:", error);
      }
    };

    // Also reload on visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("landingPageConfigUpdated", handleCustomEvent as EventListener);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("landingPageConfigUpdated", handleCustomEvent as EventListener);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const saveConfig = (newConfig: LandingPageConfig) => {
    setConfig(newConfig);
    localStorage.setItem("landingPageConfig", JSON.stringify(newConfig));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("landingPageConfigUpdated", { detail: newConfig }));
  };

  return { config, saveConfig, isLoading };
}
