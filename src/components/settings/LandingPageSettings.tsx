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
  Upload, 
  Palette, 
  Type, 
  Building2,
  Plus,
  Trash2,
  GripVertical,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Layout,
  Square,
  Monitor,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  useLandingPageConfig, 
  defaultLandingPageConfig,
  iconMap,
  primaryColorPresets,
  secondaryColorPresets,
  backgroundStyleOptions,
  cardStyleOptions,
  heroStyleOptions,
  type LandingPageConfig,
  type ValueCard,
  type StatisticItem,
  type BackgroundStyle,
  type CardStyle,
  type HeroStyle,
} from "@/hooks/useLandingPageConfig";

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

  const updateStats = (key: keyof LandingPageConfig["stats"], value: string) => {
    setConfig(prev => ({
      ...prev,
      stats: { ...prev.stats, [key]: value }
    }));
    setHasChanges(true);
  };

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
          A identidade visual segue um modelo de <strong>parametrização controlada</strong> para 
          garantir consistência e qualidade. Fontes, CSS e layout são gerenciados automaticamente.
        </AlertDescription>
      </Alert>

      {/* Branding Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Identidade Visual
          </CardTitle>
          <CardDescription>
            Configure cores e marca da página de carreiras
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={config.companyName}
                onChange={(e) => updateConfig("companyName", e.target.value)}
                placeholder="Nome exibido na página"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL do Logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logoUrl"
                  value={config.logoUrl}
                  onChange={(e) => updateConfig("logoUrl", e.target.value)}
                  placeholder="https://..."
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

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

      {/* Visual Style Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Estilo Visual
          </CardTitle>
          <CardDescription>
            Escolha entre opções pré-definidas de layout e estilo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Background Style */}
          <div className="space-y-3">
            <Label>Estilo de Fundo</Label>
            <RadioGroup
              value={config.backgroundStyle}
              onValueChange={(value) => updateConfig("backgroundStyle", value as BackgroundStyle)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {backgroundStyleOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`bg-${option.value}`} />
                  <Label htmlFor={`bg-${option.value}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Card Style */}
          <div className="space-y-3">
            <Label>Estilo de Cards</Label>
            <RadioGroup
              value={config.cardStyle}
              onValueChange={(value) => updateConfig("cardStyle", value as CardStyle)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {cardStyleOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`card-${option.value}`} />
                  <Label htmlFor={`card-${option.value}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Hero Style */}
          <div className="space-y-3">
            <Label>Estilo do Hero</Label>
            <RadioGroup
              value={config.heroStyle}
              onValueChange={(value) => updateConfig("heroStyle", value as HeroStyle)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {heroStyleOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`hero-${option.value}`} />
                  <Label htmlFor={`hero-${option.value}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

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
          <div className="space-y-2">
            <Label htmlFor="heroCta">Texto do Botão CTA</Label>
            <Input
              id="heroCta"
              value={config.heroCta}
              onChange={(e) => updateConfig("heroCta", e.target.value)}
              placeholder="Ex: Ver vagas abertas"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exibir Estatísticas</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar números de vagas, contratados e áreas
              </p>
            </div>
            <Switch
              checked={config.showStats}
              onCheckedChange={(checked) => updateConfig("showStats", checked)}
            />
          </div>

          {config.showStats && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="statsJobs">Vagas Abertas</Label>
                <Input
                  id="statsJobs"
                  value={config.stats.jobs}
                  onChange={(e) => updateStats("jobs", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statsHired">Pessoas Contratadas</Label>
                <Input
                  id="statsHired"
                  value={config.stats.hired}
                  onChange={(e) => updateStats("hired", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statsAreas">Áreas de Atuação</Label>
                <Input
                  id="statsAreas"
                  value={config.stats.areas}
                  onChange={(e) => updateStats("areas", e.target.value)}
                />
              </div>
            </div>
          )}
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
              
              <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Estatísticas</Label>
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
          <div className="grid gap-4 sm:grid-cols-2">
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
        </CardContent>
      </Card>

      {/* Jobs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Seção de Vagas</CardTitle>
          <CardDescription>
            Configure os textos da seção de vagas abertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jobsSectionTitle">Título</Label>
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
    </div>
  );
}
