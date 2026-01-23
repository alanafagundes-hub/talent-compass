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

export interface LandingPageConfig {
  // Hero Section
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  showStats: boolean;
  stats: {
    jobs: string;
    hired: string;
    areas: string;
  };
  
  // Statistics Section (Employer Branding)
  showStatisticsSection: boolean;
  statisticsSectionTitle: string;
  statisticsSectionSubtitle: string;
  statistics: StatisticItem[];
  
  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  values: ValueCard[];
  
  // Jobs Section
  jobsSectionTitle: string;
  jobsSectionSubtitle: string;
  
  // CTA Final
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  showTalentPoolCta: boolean;
  
  // Design
  primaryColor: string;
  logoUrl: string;
  companyName: string;
}

export const defaultLandingPageConfig: LandingPageConfig = {
  heroHeadline: "Construa sua carreira com a gente",
  heroSubheadline: "Junte-se a uma equipe apaixonada por inovação e faça parte de projetos que transformam o mercado.",
  heroCta: "Ver vagas abertas",
  showStats: true,
  stats: {
    jobs: "12",
    hired: "150+",
    areas: "8",
  },
  showStatisticsSection: true,
  statisticsSectionTitle: "Nossos Números",
  statisticsSectionSubtitle: "Resultados que refletem nossa dedicação e crescimento contínuo",
  statistics: [
    { id: "1", title: "Colaboradores", value: "+120", description: "em crescimento constante" },
    { id: "2", title: "Anos de Mercado", value: "8", description: "de experiência consolidada" },
    { id: "3", title: "Projetos Entregues", value: "500+", description: "com excelência" },
    { id: "4", title: "Satisfação", value: "95%", description: "dos nossos clientes" },
  ],
  aboutTitle: "Por que trabalhar conosco?",
  aboutSubtitle: "Descubra o que faz da nossa empresa um ótimo lugar para crescer profissionalmente",
  values: [
    { id: "1", icon: "Sparkles", title: "Inovação Constante", description: "Trabalhamos com as tecnologias mais modernas do mercado e incentivamos a experimentação." },
    { id: "2", icon: "Users", title: "Cultura Colaborativa", description: "Valorizamos o trabalho em equipe e a troca de conhecimentos entre todos." },
    { id: "3", icon: "Heart", title: "Bem-estar em Primeiro Lugar", description: "Oferecemos benefícios que cuidam de você e da sua família." },
    { id: "4", icon: "TrendingUp", title: "Crescimento Acelerado", description: "Plano de carreira estruturado com oportunidades reais de evolução." },
  ],
  jobsSectionTitle: "Vagas Abertas",
  jobsSectionSubtitle: "Encontre a oportunidade perfeita para o próximo passo da sua carreira",
  ctaTitle: "Não encontrou a vaga ideal?",
  ctaSubtitle: "Cadastre-se em nosso banco de talentos e seja o primeiro a saber quando surgirem novas oportunidades na sua área.",
  ctaButtonText: "Cadastrar no Banco de Talentos",
  showTalentPoolCta: true,
  primaryColor: "#8B5CF6",
  logoUrl: "",
  companyName: "DOT",
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
      stats: {
        ...defaultLandingPageConfig.stats,
        ...(saved.stats || {}),
      },
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

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("landingPageConfigUpdated", handleCustomEvent as EventListener);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("landingPageConfigUpdated", handleCustomEvent as EventListener);
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
