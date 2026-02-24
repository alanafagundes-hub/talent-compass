import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  Building2,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  DollarSign,
} from "lucide-react";
import { JobSection } from "@/components/public/JobSection";
import { toast } from "sonner";
import { usePublicJobs, type PublicJob } from "@/hooks/usePublicJobs";
import { useLandingPageConfig } from "@/hooks/useLandingPageConfig";
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/db-helper";
import { useTrackingParams, resolveSourceName } from "@/hooks/useTrackingParams";

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

// Work model labels
const workModelLabels: Record<string, string> = {
  remoto: "Remoto",
  presencial: "Presencial",
  hibrido: "Híbrido",
};

interface DbFormField {
  id: string;
  template_id: string;
  label: string;
  field_type: string;
  is_required: boolean;
  order_index: number;
  placeholder: string | null;
  options: string[] | null;
}

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  resumeFile: File | null;
  lgpdConsent: boolean;
  customFields: Record<string, string | string[] | boolean>;
}

export default function VagaPublica() {
  const { id } = useParams<{ id: string }>();
  const { setTheme } = useTheme();
  const { fetchJobById } = usePublicJobs();
  const { config } = useLandingPageConfig();
  const trackingData = useTrackingParams();
  
  const [job, setJob] = useState<PublicJob | null>(null);
  const [formFields, setFormFields] = useState<DbFormField[]>([]);
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

  // Force dark mode on public pages
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (id) {
        const jobData = await fetchJobById(id);
        setJob(jobData);
        
        // Load form fields if job has a form template
        if (jobData?.form_template_id) {
          const { data: fields } = await fromTable('form_fields')
            .select('*')
            .eq('template_id', jobData.form_template_id)
            .order('order_index', { ascending: true });
          
          setFormFields((fields || []) as DbFormField[]);
        }
      }
      setIsLoading(false);
    };
    
    loadData();
  }, [id, fetchJobById]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
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
    formFields.forEach((field) => {
      if (field.is_required) {
        const value = formData.customFields[field.id];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[`custom_${field.id}`] = `${field.label} é obrigatório`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !job) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setIsSubmitting(true);

    try {
      const sourceName = resolveSourceName(trackingData);

      // 1. Create or find candidate
      const { data: existingCandidate } = await fromTable('candidates')
        .select('id')
        .eq('email', formData.email.trim().toLowerCase())
        .maybeSingle();

      let candidateId = existingCandidate?.id;
      let resumeUrl: string | null = null;

      // Upload resume
      if (formData.resumeFile) {
        const file = formData.resumeFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const tempPath = `temp/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(tempPath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Resume upload error:', uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('resumes')
            .getPublicUrl(tempPath);
          resumeUrl = urlData.publicUrl;
        }
      }

      if (!candidateId) {
        const { data: newCandidate, error: candidateError } = await fromTable('candidates')
          .insert({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            linkedin_url: formData.linkedin.trim(),
            source: sourceName,
            resume_url: resumeUrl,
          })
          .select('id')
          .single();

        if (candidateError) throw candidateError;
        candidateId = newCandidate?.id;
      } else if (resumeUrl) {
        await fromTable('candidates')
          .update({ resume_url: resumeUrl })
          .eq('id', candidateId);
      }

      // 2. Get the first stage of the job's funnel
      const { data: funnel } = await fromTable('funnels')
        .select('id')
        .eq('job_id', job.id)
        .eq('is_active', true)
        .maybeSingle();

      let firstStageId = null;
      if (funnel) {
        const { data: firstStage } = await fromTable('funnel_stages')
          .select('id')
          .eq('funnel_id', funnel.id)
          .eq('is_archived', false)
          .order('order_index', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        firstStageId = firstStage?.id;
      }

      // 3. Create application
      const { data: application, error: appError } = await fromTable('applications')
        .insert({
          candidate_id: candidateId,
          job_id: job.id,
          source: sourceName,
          current_stage_id: firstStageId,
          status: 'ativa',
          tracking_data: trackingData as unknown as Record<string, unknown>,
        })
        .select('id')
        .single();

      if (appError) throw appError;

      // 4. Save form responses
      if (formFields.length > 0 && application) {
        const responses = formFields
          .filter(field => formData.customFields[field.id])
          .map(field => ({
            application_id: application.id,
            field_id: field.id,
            value: String(formData.customFields[field.id]),
          }));

        if (responses.length > 0) {
          await fromTable('form_responses').insert(responses);
        }
      }

      // 5. Record history
      if (application && firstStageId) {
        await fromTable('application_history').insert({
          application_id: application.id,
          action: 'applied',
          to_stage_id: firstStageId,
          notes: `Candidatura recebida via ${sourceName}`,
        });
      }

      setIsSubmitted(true);
      toast.success("Candidatura enviada com sucesso!");
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Erro ao enviar candidatura. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxSize = 5 * 1024 * 1024;

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

  const renderCustomField = (field: DbFormField) => {
    const value = formData.customFields[field.id] || "";
    const error = errors[`custom_${field.id}`];

    switch (field.field_type) {
      case "short_text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.is_required && <span className="text-destructive">*</span>}
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
              placeholder={field.placeholder || undefined}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "long_text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.is_required && <span className="text-destructive">*</span>}
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
              placeholder={field.placeholder || undefined}
              rows={4}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case "yes_no":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label} {field.is_required && <span className="text-destructive">*</span>}
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
        const options = (field.options as string[]) || [];
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label} {field.is_required && <span className="text-destructive">*</span>}
            </Label>
            <div className="space-y-2">
              {options.map((option) => (
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
      <div className="min-h-screen flex items-center justify-center bg-background dark">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold">Vaga não encontrada</h2>
            <p className="mt-2 text-muted-foreground">
              Esta vaga não existe.
            </p>
            <Button asChild className="mt-4" style={{ backgroundColor: config.secondaryColor }}>
              <Link to="/carreiras">Ver outras vagas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (job.status !== "publicada") {
    const statusMessages: Record<string, string> = {
      rascunho: "Esta vaga ainda está em preparação.",
      pausada: "Esta vaga está temporariamente pausada e não está aceitando novas candidaturas.",
      encerrada: "Esta vaga foi encerrada e não está mais aceitando candidaturas.",
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold">Vaga indisponível</h2>
            <p className="mt-2 text-muted-foreground">
              {statusMessages[job.status] || "Esta vaga não está aceitando candidaturas no momento."}
            </p>
            <Button asChild className="mt-4" style={{ backgroundColor: config.secondaryColor }}>
              <Link to="/carreiras">Ver outras vagas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto" style={{ color: config.secondaryColor }} />
            <h2 className="mt-4 text-2xl font-bold">Candidatura Enviada!</h2>
            <p className="mt-2 text-muted-foreground">
              Obrigado por se candidatar à vaga de <strong>{job.title}</strong>.
              Analisaremos seu perfil e entraremos em contato em breve.
            </p>
            <div className="mt-6 space-y-2">
              <Button asChild className="w-full" style={{ backgroundColor: config.secondaryColor }}>
                <Link to="/carreiras">Ver outras vagas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryColor = config.primaryColor;
  const secondaryColor = config.secondaryColor;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link to="/carreiras" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar para vagas</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Job Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.area && (
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                {job.area.name}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <Briefcase className="h-3 w-3" />
              {jobLevelLabels[job.level] || job.level}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              {contractTypeLabels[job.contract_type] || job.contract_type}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" />
              {workModelLabels[job.work_model] || job.work_model}
            </Badge>
            {job.location && (
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </Badge>
            )}
            {(job.salary_min || job.salary_max) && (
              <Badge variant="outline" className="gap-1">
                <DollarSign className="h-3 w-3" />
                {job.salary_min && job.salary_max
                  ? `R$ ${Number(job.salary_min).toLocaleString('pt-BR')} - R$ ${Number(job.salary_max).toLocaleString('pt-BR')}`
                  : job.salary_min
                    ? `A partir de R$ ${Number(job.salary_min).toLocaleString('pt-BR')}`
                    : `Até R$ ${Number(job.salary_max).toLocaleString('pt-BR')}`
                }
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {job.about_job && (
              <JobSection title="Sobre a Vaga" content={job.about_job} />
            )}
            {job.responsibilities && (
              <JobSection title="Responsabilidades" content={job.responsibilities} />
            )}
            {job.requirements_text && (
              <JobSection title="Requisitos" content={job.requirements_text} />
            )}
            {job.nice_to_have && (
              <JobSection title="Diferenciais" content={job.nice_to_have} />
            )}
            {job.about_company && (
              <JobSection title="Sobre a Empresa" content={job.about_company} />
            )}
            {job.additional_info && (
              <JobSection title="Informações Adicionais" content={job.additional_info} />
            )}
            {/* Fallback to legacy fields */}
            {!job.about_job && job.description && (
              <JobSection title="Descrição" content={job.description} />
            )}
            {!job.requirements_text && job.requirements && (
              <JobSection title="Requisitos" content={job.requirements} />
            )}
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Candidatar-se</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  {/* Email */}
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

                  {/* Phone */}
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

                  {/* LinkedIn */}
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

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="resume">Currículo (PDF ou Word) <span className="text-destructive">*</span></Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {formData.resumeFile && (
                      <p className="text-sm text-muted-foreground">
                        Arquivo: {formData.resumeFile.name}
                      </p>
                    )}
                    {errors.resumeFile && <p className="text-sm text-destructive">{errors.resumeFile}</p>}
                  </div>

                  {/* Custom Form Fields */}
                  {formFields.length > 0 && (
                    <>
                      <Separator />
                      {formFields.map(renderCustomField)}
                    </>
                  )}

                  <Separator />

                  {/* LGPD Consent */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="lgpd"
                      checked={formData.lgpdConsent}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, lgpdConsent: checked as boolean })
                      }
                    />
                    <Label htmlFor="lgpd" className="text-xs leading-relaxed">
                      Concordo com o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD) para fins de processo seletivo. <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  {errors.lgpdConsent && <p className="text-sm text-destructive">{errors.lgpdConsent}</p>}

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    style={{ backgroundColor: secondaryColor }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
    </div>
  );
}
