import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  FileText,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import type { Job, FormTemplate, FormField, Area } from "@/types/ats";
import { jobLevelLabels, contractTypeLabels } from "@/types/ats";
import { toast } from "sonner";

// Mock data - would come from API/database
const mockJobs: Record<string, Job> = {
  "1": {
    id: "1",
    title: "Desenvolvedor Frontend Senior",
    areaId: "1",
    level: "senior",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: true,
    description: `Estamos buscando um Desenvolvedor Frontend Senior para liderar projetos de alta complexidade e contribuir com a evolução técnica do time.

**Responsabilidades:**
- Desenvolver interfaces web modernas e responsivas
- Liderar tecnicamente projetos e mentorear desenvolvedores mais junior
- Participar ativamente de decisões de arquitetura
- Garantir qualidade de código através de code reviews
- Colaborar com designers e product managers

**Benefícios:**
- Plano de saúde e odontológico
- Vale refeição e alimentação
- Gympass
- Home office flexível
- PLR`,
    requirements: `- 5+ anos de experiência com desenvolvimento frontend
- Domínio de React, TypeScript e ferramentas modernas
- Experiência com testes automatizados
- Conhecimento de padrões de design e arquitetura
- Inglês intermediário/avançado`,
    status: "publicada",
    priority: "alta",
    formTemplateId: "1",
    isArchived: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  "2": {
    id: "2",
    title: "Designer UX/UI",
    areaId: "3",
    level: "pleno",
    contractType: "clt",
    location: "Rio de Janeiro, RJ",
    isRemote: true,
    description: `Buscamos um Designer UX/UI apaixonado por criar experiências incríveis para nossos usuários.

**O que você vai fazer:**
- Criar wireframes, protótipos e interfaces finais
- Conduzir pesquisas com usuários
- Colaborar com times de produto e desenvolvimento
- Manter e evoluir nosso design system`,
    status: "publicada",
    priority: "media",
    formTemplateId: "1",
    isArchived: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
};

const mockAreas: Record<string, Area> = {
  "1": { id: "1", name: "Tech", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  "3": { id: "3", name: "Criação", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
};

const mockFormTemplates: Record<string, FormTemplate> = {
  "1": {
    id: "1",
    name: "Formulário Padrão",
    fields: [
      { id: "custom1", label: "Por que você quer trabalhar conosco?", type: "long_text", required: true, order: 1 },
      { id: "custom2", label: "Pretensão salarial (R$)", type: "short_text", required: false, order: 2 },
    ],
    isDefault: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

interface ApplicationFormData {
  // Standard required fields
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  resumeFile: File | null;
  // LGPD consent
  lgpdConsent: boolean;
  // Dynamic fields from template
  customFields: Record<string, string | string[] | boolean>;
}

export default function VagaPublica() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [formTemplate, setFormTemplate] = useState<FormTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    resumeFile: null,
    lgpdConsent: false,
    customFields: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id && mockJobs[id]) {
        const jobData = mockJobs[id];
        setJob(jobData);
        setArea(mockAreas[jobData.areaId] || null);
        
        if (jobData.formTemplateId && mockFormTemplates[jobData.formTemplateId]) {
          setFormTemplate(mockFormTemplates[jobData.formTemplateId]);
        }
      }
      setIsLoading(false);
    };
    
    loadData();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (!formData.linkedin.trim()) {
      newErrors.linkedin = "LinkedIn é obrigatório";
    }

    if (!formData.resumeFile) {
      newErrors.resumeFile = "Currículo é obrigatório";
    }

    if (!formData.lgpdConsent) {
      newErrors.lgpdConsent = "Você precisa aceitar os termos para continuar";
    }

    // Validate custom required fields
    if (formTemplate) {
      formTemplate.fields.forEach((field) => {
        if (field.required) {
          const value = formData.customFields[field.id];
          if (!value || (typeof value === "string" && !value.trim())) {
            newErrors[`custom_${field.id}`] = `${field.label} é obrigatório`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Capture source from URL params (utm_source) or referrer
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const referrer = document.referrer;
      
      // Determine source for metrics
      let sourceId = '3'; // Default: Site Carreiras
      let sourceName = 'Site Carreiras';
      
      if (utmSource) {
        if (utmSource.toLowerCase().includes('linkedin')) {
          sourceId = '1';
          sourceName = 'LinkedIn';
        } else if (utmSource.toLowerCase().includes('indicacao')) {
          sourceId = '2';
          sourceName = 'Indicação Interna';
        } else {
          sourceName = utmSource;
        }
      } else if (referrer.includes('linkedin.com')) {
        sourceId = '1';
        sourceName = 'LinkedIn';
      }

      // Data to be persisted (for future database integration):
      const applicationData = {
        // Candidate data
        candidate: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          linkedinUrl: formData.linkedin.trim(),
        },
        // Card data with metrics
        card: {
          jobId: job?.id,
          sourceId,
          sourceName,
          appliedAt: new Date(),
          customFields: formData.customFields,
        },
        // Initial stage history for metrics
        stageHistory: {
          stepName: 'Inscritos',
          stepOrder: 1,
          enteredAt: new Date(),
        },
        // Application history for metrics
        history: {
          action: 'applied',
          notes: `Candidatura recebida via ${sourceName}`,
          createdAt: new Date(),
        },
      };

      console.log("Application data with metrics:", applicationData);

      setIsSubmitted(true);
      toast.success("Candidatura enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar candidatura. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, resumeFile: "Apenas arquivos PDF ou Word são aceitos" });
        return;
      }

      if (file.size > maxSize) {
        setErrors({ ...errors, resumeFile: "O arquivo deve ter no máximo 5MB" });
        return;
      }

      setFormData({ ...formData, resumeFile: file });
      setErrors({ ...errors, resumeFile: "" });
    }
  };

  const renderCustomField = (field: FormField) => {
    const value = formData.customFields[field.id] || "";
    const error = errors[`custom_${field.id}`];

    switch (field.type) {
      case "short_text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              value={value as string}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customFields: { ...formData.customFields, [field.id]: e.target.value },
                })
              }
              placeholder={field.placeholder}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "long_text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value as string}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customFields: { ...formData.customFields, [field.id]: e.target.value },
                })
              }
              placeholder={field.placeholder}
              rows={4}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "yes_no":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup
              value={value as string}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  customFields: { ...formData.customFields, [field.id]: v },
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id={`${field.id}-sim`} />
                <Label htmlFor={`${field.id}-sim`}>Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id={`${field.id}-nao`} />
                <Label htmlFor={`${field.id}-nao`}>Não</Label>
              </div>
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "multiple_choice":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={(value as string[] || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const current = (formData.customFields[field.id] as string[]) || [];
                      const updated = checked
                        ? [...current, option]
                        : current.filter((v) => v !== option);
                      setFormData({
                        ...formData,
                        customFields: { ...formData.customFields, [field.id]: updated },
                      });
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (!job || job.status !== "publicada") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold">Vaga não encontrada</h2>
            <p className="mt-2 text-muted-foreground">
              Esta vaga não existe ou não está mais disponível.
            </p>
            <Button asChild className="mt-4">
              <Link to="/">Voltar para o início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Candidatura Enviada!</h2>
            <p className="mt-2 text-muted-foreground">
              Obrigado por se candidatar à vaga de <strong>{job.title}</strong>.
              Analisaremos seu perfil e entraremos em contato em breve.
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Voltar para o início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para vagas
          </Link>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Job Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {area && (
                  <Badge variant="secondary" className="gap-1">
                    <Building2 className="h-3 w-3" />
                    {area.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
                {job.isRemote && (
                  <Badge variant="outline" className="ml-1">Remoto</Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>{jobLevelLabels[job.level]} • {contractTypeLabels[job.contractType]}</span>
              </div>
            </div>

            <Separator />

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-3">Sobre a vaga</h3>
              <div className="whitespace-pre-wrap text-muted-foreground">
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-3">Requisitos</h3>
                <div className="whitespace-pre-wrap text-muted-foreground">
                  {job.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Candidatar-se
                </CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo para se candidatar a esta vaga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Standard Required Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone <span className="text-destructive">*</span></Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn <span className="text-destructive">*</span></Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/seu-perfil"
                    />
                    {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Currículo <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      {formData.resumeFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Arquivo: {formData.resumeFile.name}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">PDF ou Word, máximo 5MB</p>
                    {errors.resumeFile && <p className="text-sm text-destructive">{errors.resumeFile}</p>}
                  </div>

                  {/* Custom Fields from Form Template */}
                  {formTemplate && formTemplate.fields.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      {formTemplate.fields.map(renderCustomField)}
                    </>
                  )}

                  <Separator className="my-4" />

                  {/* LGPD Consent */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="lgpd"
                        checked={formData.lgpdConsent}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, lgpdConsent: checked as boolean })
                        }
                      />
                      <Label htmlFor="lgpd" className="text-sm leading-relaxed">
                        Declaro que li e concordo com a{" "}
                        <a href="/politica-privacidade" target="_blank" className="text-primary underline">
                          Política de Privacidade
                        </a>{" "}
                        e autorizo a DOT a armazenar e processar meus dados pessoais para fins de 
                        recrutamento e seleção, conforme a LGPD. <span className="text-destructive">*</span>
                      </Label>
                    </div>
                    {errors.lgpdConsent && <p className="text-sm text-destructive">{errors.lgpdConsent}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Candidatura"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DOT. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
