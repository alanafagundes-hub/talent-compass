import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Save, 
  Eye, 
  Palette, 
  Type, 
  Building2,
  Plus,
  Trash2,
  GripVertical,
  BarChart3,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Briefcase,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogoUpload } from "./LogoUpload";
import { 
  useLandingPageConfig, 
  defaultLandingPageConfig,
  iconMap,
  primaryColorPresets,
  secondaryColorPresets,
  type LandingPageConfig,
  type ValueCard,
  type StatisticItem,
  type CtaAction,
} from "@/hooks/useLandingPageConfig";

// CTA action options for radio groups
const ctaActionOptions = [
  { value: "jobs" as const, label: "Ir para Vagas", description: "Scroll suave até a seção de vagas" },
  { value: "talent-pool" as const, label: "Banco de Talentos", description: "Redireciona para cadastro de talentos" },
  { value: "culture" as const, label: "Conhecer Cultura", description: "Scroll até a seção institucional" },
];

const iconOptions = Object.keys(iconMap).map(key => ({
  value: key,
  label: key === "Sparkles" ? "Inovação" :
         key === "Users" ? "Pessoas" :
         key === "Heart" ? "Coração" :
         key === "TrendingUp" ? "Crescimento" :
         key === "Rocket" ? "Foguete" :
         key === "Target" ? "Alvo" :
         key === "Building2" ? "Empresa" :
         key === "Award" ? "Prêmio" :
         key === "Star" ? "Estrela" :
         key === "Clock" ? "Relógio" :
         key === "Globe" ? "Global" :
         key === "Zap" ? "Energia" :
         key === "CheckCircle" ? "Verificado" :
         key === "Trophy" ? "Troféu" : key,
}));

export default function LandingPageSettings() {
  const { config: savedConfig, saveConfig, isLoading } = useLandingPageConfig();
  const [config, setConfig] = useState<LandingPageConfig>(savedConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync local state with saved config when it changes externally
  useEffect(() => {
    if (!isInitialized) {
      setConfig(savedConfig);
      setIsInitialized(true);
    }
  }, [savedConfig, isInitialized]);

  const updateConfig = <K extends keyof LandingPageConfig>(
    key: K,
    value: LandingPageConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Removed: updateStats function (stats removed from Hero)

  const updateValue = (id: string, field: keyof ValueCard, value: string) => {
    setConfig(prev => ({
      ...prev,
      values: prev.values.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    }));
    setHasChanges(true);
  };

  const addValue = () => {
    const newValue: ValueCard = {
      id: Date.now().toString(),
      icon: "Sparkles",
      title: "Novo Valor",
      description: "Descrição do valor",
    };
    setConfig(prev => ({
      ...prev,
      values: [...prev.values, newValue]
    }));
    setHasChanges(true);
  };

  const removeValue = (id: string) => {
    setConfig(prev => ({
      ...prev,
      values: prev.values.filter(v => v.id !== id)
    }));
    setHasChanges(true);
  };

  // Statistics management
  const updateStatistic = (id: string, field: keyof StatisticItem, value: string) => {
    setConfig(prev => ({
      ...prev,
      statistics: prev.statistics.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
    setHasChanges(true);
  };

  const addStatistic = () => {
    const newStatistic: StatisticItem = {
      id: Date.now().toString(),
      title: "Nova Estatística",
      value: "100+",
      description: "descrição opcional",
    };
    setConfig(prev => ({
      ...prev,
      statistics: [...prev.statistics, newStatistic]
    }));
    setHasChanges(true);
  };

  const removeStatistic = (id: string) => {
    setConfig(prev => ({
      ...prev,
      statistics: prev.statistics.filter(s => s.id !== id)
    }));
    setHasChanges(true);
  };

  const moveStatistic = (id: string, direction: "up" | "down") => {
    setConfig(prev => {
      const stats = [...prev.statistics];
      const index = stats.findIndex(s => s.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= stats.length) return prev;
      
      [stats[index], stats[newIndex]] = [stats[newIndex], stats[index]];
      return { ...prev, statistics: stats };
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    saveConfig(config);
    setHasChanges(false);
    toast.success("Configurações da Landing Page salvas!");
  };

  const handlePreview = () => {
    // Always save current config before preview
    saveConfig(config);
    setHasChanges(false);
    // Encode config in URL for cross-origin/iframe preview
    const configParam = encodeURIComponent(JSON.stringify(config));
    setTimeout(() => {
      window.open(`/carreiras?preview=${configParam}`, "_blank");
    }, 50);
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || iconMap.Sparkles;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Landing Page de Carreiras</h3>
          <p className="text-sm text-muted-foreground">
            Configure a aparência e conteúdo da página pública de vagas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} className="gap-2">
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Governance Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Governança Visual:</strong> A página pública opera em <strong>dark mode fixo</strong> para 
          garantir consistência. Apenas cores (principal e secundária) e logo são configuráveis. 
          Fontes, CSS e layout são gerenciados automaticamente.
        </AlertDescription>
      </Alert>

      {/* Branding Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Identidade Visual
              </CardTitle>
              <CardDescription>
                Configure cores e marca da página de carreiras
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-sm">
              <Moon className="h-4 w-4" />
              <span className="font-medium">Dark Mode Fixo</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              value={config.companyName}
              onChange={(e) => updateConfig("companyName", e.target.value)}
              placeholder="Nome exibido na página"
            />
          </div>

          <Separator />

          {/* Logo Upload */}
          <LogoUpload
            currentLogoUrl={config.logoUrl}
            onLogoChange={(url) => updateConfig("logoUrl", url)}
          />

          <Separator />

          {/* Primary Color */}
          <div className="space-y-3">
            <Label>Cor Principal</Label>
            <p className="text-sm text-muted-foreground">
              Usada em títulos, destaques e elementos principais
            </p>
            <div className="flex flex-wrap gap-3">
              {primaryColorPresets.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    config.primaryColor === color.value 
                      ? 'ring-2 ring-offset-2 ring-primary border-primary' 
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => updateConfig("primaryColor", color.value)}
                  title={color.name}
                />
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => updateConfig("primaryColor", e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
              </div>
            </div>
          </div>

          {/* Secondary Color */}
          <div className="space-y-3">
            <Label>Cor Secundária (CTAs e Links)</Label>
            <p className="text-sm text-muted-foreground">
              Usada exclusivamente em botões de ação, links e badges
            </p>
            <div className="flex flex-wrap gap-3">
              {secondaryColorPresets.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    config.secondaryColor === color.value 
                      ? 'ring-2 ring-offset-2 ring-primary border-primary' 
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => updateConfig("secondaryColor", color.value)}
                  title={color.name}
                />
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Style is now fixed - removed customization to maintain consistency */}

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Seção Hero
          </CardTitle>
          <CardDescription>
            Configure o título e chamada principal da página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroBadgeText">Texto do Badge</Label>
              <Input
                id="heroBadgeText"
                value={config.heroBadgeText}
                onChange={(e) => updateConfig("heroBadgeText", e.target.value)}
                placeholder="Ex: Estamos contratando!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headerCtaText">Botão do Header</Label>
              <Input
                id="headerCtaText"
                value={config.headerCtaText}
                onChange={(e) => updateConfig("headerCtaText", e.target.value)}
                placeholder="Ex: Ver Vagas"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroHeadline">Título Principal (Headline)</Label>
            <Input
              id="heroHeadline"
              value={config.heroHeadline}
              onChange={(e) => updateConfig("heroHeadline", e.target.value)}
              placeholder="Ex: Construa sua carreira com a gente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubheadline">Subtítulo</Label>
            <Textarea
              id="heroSubheadline"
              value={config.heroSubheadline}
              onChange={(e) => updateConfig("heroSubheadline", e.target.value)}
              placeholder="Texto complementar ao título..."
              rows={2}
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroCta">Botão Principal (CTA)</Label>
              <Input
                id="heroCta"
                value={config.heroCta}
                onChange={(e) => updateConfig("heroCta", e.target.value)}
                placeholder="Ex: Explorar oportunidades"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSecondaryCta">Botão Secundário</Label>
              <Input
                id="heroSecondaryCta"
                value={config.heroSecondaryCta}
                onChange={(e) => updateConfig("heroSecondaryCta", e.target.value)}
                placeholder="Ex: Conheça a empresa"
              />
            </div>
          </div>

          <Separator />

          {/* CTA Action Configuration */}
          <div className="space-y-3">
            <Label>Ação do CTA Principal</Label>
            <p className="text-sm text-muted-foreground">
              Para onde o botão principal do Hero deve direcionar
            </p>
            <RadioGroup
              value={config.heroCtaAction}
              onValueChange={(value) => updateConfig("heroCtaAction", value as CtaAction)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {ctaActionOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`hero-cta-${option.value}`} />
                  <Label htmlFor={`hero-cta-${option.value}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Seção de Estatísticas
          </CardTitle>
          <CardDescription>
            Configure estatísticas institucionais para employer branding e prova social
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exibir Seção de Estatísticas</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar estatísticas institucionais na página pública
              </p>
            </div>
            <Switch
              checked={config.showStatisticsSection}
              onCheckedChange={(checked) => updateConfig("showStatisticsSection", checked)}
            />
          </div>

          {config.showStatisticsSection && (
            <>
              <Separator />
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="statisticsBadgeText">Badge</Label>
                  <Input
                    id="statisticsBadgeText"
                    value={config.statisticsBadgeText}
                    onChange={(e) => updateConfig("statisticsBadgeText", e.target.value)}
                    placeholder="Ex: Nosso Impacto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statisticsSectionTitle">Título da Seção</Label>
                  <Input
                    id="statisticsSectionTitle"
                    value={config.statisticsSectionTitle}
                    onChange={(e) => updateConfig("statisticsSectionTitle", e.target.value)}
                    placeholder="Ex: Nossos Números"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statisticsSectionSubtitle">Subtítulo</Label>
                  <Input
                    id="statisticsSectionSubtitle"
                    value={config.statisticsSectionSubtitle}
                    onChange={(e) => updateConfig("statisticsSectionSubtitle", e.target.value)}
                    placeholder="Descrição breve da seção"
                  />
                </div>
              </div>

              <Separator />

              {/* Automatic Stats Notice */}
              <Alert className="bg-muted/50">
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Vagas Abertas</strong> é exibida automaticamente com base nas vagas publicadas no ATS. 
                  Ela aparece apenas quando há vagas ativas e não pode ser editada manualmente.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Estatísticas Institucionais</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dados manuais para employer branding (ex: colaboradores, anos de mercado)
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addStatistic} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-3">
                  {config.statistics.map((stat, index) => (
                    <div key={stat.id} className="flex gap-3 rounded-lg border p-4 bg-muted/30">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveStatistic(stat.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveStatistic(stat.id, "down")}
                          disabled={index === config.statistics.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex-1 grid gap-3 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Valor (destaque)</Label>
                          <Input
                            value={stat.value}
                            onChange={(e) => updateStatistic(stat.id, "value", e.target.value)}
                            placeholder="Ex: +120, 95%, 8 anos"
                            className="font-bold text-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Título</Label>
                          <Input
                            value={stat.title}
                            onChange={(e) => updateStatistic(stat.id, "title", e.target.value)}
                            placeholder="Ex: Colaboradores"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Descrição (opcional)</Label>
                          <Input
                            value={stat.description || ""}
                            onChange={(e) => updateStatistic(stat.id, "description", e.target.value)}
                            placeholder="Ex: em crescimento constante"
                          />
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => removeStatistic(stat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {config.statistics.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma estatística configurada</p>
                      <p className="text-sm">Clique em "Adicionar" para criar a primeira</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Seção Institucional
          </CardTitle>
          <CardDescription>
            Configure os valores e diferenciais da empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exibir Seção de Cultura</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar seção institucional com valores e diferenciais
              </p>
            </div>
            <Switch
              checked={config.showCultureSection}
              onCheckedChange={(checked) => updateConfig("showCultureSection", checked)}
            />
          </div>

          {config.showCultureSection && (
            <>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cultureBadgeText">Badge</Label>
                  <Input
                    id="cultureBadgeText"
                    value={config.cultureBadgeText}
                    onChange={(e) => updateConfig("cultureBadgeText", e.target.value)}
                    placeholder="Ex: Sobre nós"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle">Título da Seção</Label>
                  <Input
                    id="aboutTitle"
                    value={config.aboutTitle}
                    onChange={(e) => updateConfig("aboutTitle", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutSubtitle">Subtítulo</Label>
                  <Input
                    id="aboutSubtitle"
                    value={config.aboutSubtitle}
                    onChange={(e) => updateConfig("aboutSubtitle", e.target.value)}
                  />
                </div>
              </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Cards de Valores</Label>
              <Button variant="outline" size="sm" onClick={addValue} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-4">
              {config.values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <div key={value.id} className="flex gap-3 rounded-lg border p-4">
                    <div className="flex items-start pt-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                        <div className="space-y-2">
                          <Label>Ícone</Label>
                          <select
                            value={value.icon}
                            onChange={(e) => updateValue(value.id, "icon", e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {iconOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            value={value.title}
                            onChange={(e) => updateValue(value.id, "title", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={value.description}
                          onChange={(e) => updateValue(value.id, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeValue(value.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* CTA after Culture Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>CTA Pós-Cultura</Label>
                <p className="text-sm text-muted-foreground">
                  Botão exibido após os valores da empresa (tom: convite leve)
                </p>
              </div>
              <Switch
                checked={config.showCultureCta}
                onCheckedChange={(checked) => updateConfig("showCultureCta", checked)}
              />
            </div>

            {config.showCultureCta && (
              <div className="space-y-4 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="cultureCta">Texto do Botão</Label>
                  <Input
                    id="cultureCta"
                    value={config.cultureCta}
                    onChange={(e) => updateConfig("cultureCta", e.target.value)}
                    placeholder="Ex: Quero fazer parte"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Ação do CTA</Label>
                  <RadioGroup
                    value={config.cultureCtaAction}
                    onValueChange={(value) => updateConfig("cultureCtaAction", value as CtaAction)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    {ctaActionOptions.filter(o => o.value !== "culture").map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`culture-cta-${option.value}`} />
                        <Label htmlFor={`culture-cta-${option.value}`} className="flex flex-col cursor-pointer">
                          <span className="font-medium">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Jobs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Seção de Vagas</CardTitle>
          <CardDescription>
            As vagas são carregadas automaticamente do ATS. Configure apenas os textos da seção.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exibir Seção de Vagas</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar listagem de vagas abertas do ATS
              </p>
            </div>
            <Switch
              checked={config.showJobsSection}
              onCheckedChange={(checked) => updateConfig("showJobsSection", checked)}
            />
          </div>

          {config.showJobsSection && (
            <>
              <Separator />
              
              <Alert className="bg-muted/50">
                <Briefcase className="h-4 w-4" />
                <AlertDescription>
                  As vagas exibidas vêm diretamente do ATS. Apenas vagas com status "Publicada" 
                  aparecem na página de carreiras. Não é possível criar ou editar vagas por aqui.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="jobsBadgeText">Badge</Label>
                  <Input
                    id="jobsBadgeText"
                    value={config.jobsBadgeText}
                    onChange={(e) => updateConfig("jobsBadgeText", e.target.value)}
                    placeholder="Ex: Oportunidades"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobsSectionTitle">Título da Seção</Label>
                  <Input
                    id="jobsSectionTitle"
                    value={config.jobsSectionTitle}
                    onChange={(e) => updateConfig("jobsSectionTitle", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobsSectionSubtitle">Subtítulo</Label>
                  <Input
                    id="jobsSectionSubtitle"
                    value={config.jobsSectionSubtitle}
                    onChange={(e) => updateConfig("jobsSectionSubtitle", e.target.value)}
                  />
                </div>
              </div>

          <Separator />

          <div className="space-y-3">
            <Label>Estado Vazio (quando não há vagas)</Label>
            <p className="text-sm text-muted-foreground">
              Texto exibido quando não há vagas publicadas no ATS
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobsEmptyTitle" className="text-xs text-muted-foreground">Título</Label>
                <Input
                  id="jobsEmptyTitle"
                  value={config.jobsEmptyTitle}
                  onChange={(e) => updateConfig("jobsEmptyTitle", e.target.value)}
                  placeholder="Ex: Em breve, novas oportunidades!"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobsEmptySubtitle" className="text-xs text-muted-foreground">Mensagem</Label>
                <Textarea
                  id="jobsEmptySubtitle"
                  value={config.jobsEmptySubtitle}
                  onChange={(e) => updateConfig("jobsEmptySubtitle", e.target.value)}
                  placeholder="Mensagem para quando não houver vagas..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* CTA on Job Cards */}
          <div className="space-y-2">
            <Label htmlFor="jobCardCta">Texto do Botão nas Vagas</Label>
            <p className="text-sm text-muted-foreground">
              Texto do botão de ação direta em cada card de vaga (tom: ação direta)
            </p>
            <Input
              id="jobCardCta"
              value={config.jobCardCta}
              onChange={(e) => updateConfig("jobCardCta", e.target.value)}
              placeholder="Ex: Candidatar-se"
            />
          </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* CTA Final */}
      <Card>
        <CardHeader>
          <CardTitle>CTA Final</CardTitle>
          <CardDescription>
            Configure a chamada final para o banco de talentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exibir Seção de Banco de Talentos</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar CTA para cadastro no banco de talentos
              </p>
            </div>
            <Switch
              checked={config.showTalentPoolCta}
              onCheckedChange={(checked) => updateConfig("showTalentPoolCta", checked)}
            />
          </div>

          {config.showTalentPoolCta && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="ctaTitle">Título</Label>
                <Input
                  id="ctaTitle"
                  value={config.ctaTitle}
                  onChange={(e) => updateConfig("ctaTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaSubtitle">Subtítulo</Label>
                <Textarea
                  id="ctaSubtitle"
                  value={config.ctaSubtitle}
                  onChange={(e) => updateConfig("ctaSubtitle", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaButtonText">Texto do Botão</Label>
                <Input
                  id="ctaButtonText"
                  value={config.ctaButtonText}
                  onChange={(e) => updateConfig("ctaButtonText", e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Rodapé</CardTitle>
          <CardDescription>
            Configure o texto do rodapé da página
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="footerText">Texto do Rodapé</Label>
            <Input
              id="footerText"
              value={config.footerText}
              onChange={(e) => updateConfig("footerText", e.target.value)}
              placeholder="Ex: Desenvolvido com 💜 pelo time de R&S"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
