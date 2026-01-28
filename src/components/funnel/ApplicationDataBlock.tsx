import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Download,
  ExternalLink,
  Copy,
  Eye,
  Mail,
  Phone,
  Linkedin,
  User,
} from "lucide-react";
import { toast } from "sonner";
import type { FormResponse } from "@/hooks/useFunnelData";
import type { Candidate } from "@/types/ats";

interface ApplicationDataBlockProps {
  responses: FormResponse[];
  candidate?: Candidate;
}

export default function ApplicationDataBlock({ responses, candidate }: ApplicationDataBlockProps) {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  // If we have form responses, show them
  const hasFormResponses = responses && responses.length > 0;
  
  // If no form responses, show candidate data as fallback
  if (!hasFormResponses && !candidate) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum dado de candidatura registrado.
      </p>
    );
  }

  const toggleExpand = (fieldId: string) => {
    setExpandedFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  const isLongText = (text: string | null) => {
    return text && text.length > 150;
  };

  const getFieldTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      short_text: "Texto",
      long_text: "Texto longo",
      multiple_choice: "Múltipla escolha",
      yes_no: "Sim/Não",
      file_upload: "Arquivo",
    };
    return labels[type] || type;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const isPdfFile = (url: string) => {
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('application/pdf');
  };

  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop();
      return fileName || 'Arquivo';
    } catch {
      return 'Arquivo';
    }
  };

  const FileFieldRenderer = ({ fileUrl }: { fileUrl: string | null }) => {
    const [showPreview, setShowPreview] = useState(false);

    if (!fileUrl) {
      return (
        <span className="text-muted-foreground italic text-sm">
          Nenhum arquivo anexado
        </span>
      );
    }

    const fileName = getFileName(fileUrl);
    const isPdf = isPdfFile(fileUrl);

    return (
      <div className="space-y-3">
        {/* File Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
          <FileText className="h-8 w-8 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              {isPdf ? 'Documento PDF' : 'Arquivo anexado'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {/* View Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Ocultar' : 'Visualizar'}
            </Button>
            {/* External Link */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              asChild
            >
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir em nova aba"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            {/* Download */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              asChild
            >
              <a href={fileUrl} download title="Baixar arquivo">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* PDF Preview */}
        {showPreview && isPdf && (
          <div className="border rounded-lg overflow-hidden bg-muted/30">
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-[400px]"
              title={`Preview de ${fileName}`}
            >
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Não foi possível exibir o PDF no navegador.
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Clique aqui para abrir em nova aba
                </a>
              </div>
            </object>
          </div>
        )}

        {/* Non-PDF File Preview Message */}
        {showPreview && !isPdf && (
          <div className="p-4 text-center border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Visualização não disponível para este tipo de arquivo.
              <br />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Clique aqui para abrir em nova aba
              </a>
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFileField = (response: FormResponse) => {
    const fileUrl = response.fileUrl || response.value;
    return <FileFieldRenderer fileUrl={fileUrl} />;
  };

  const renderTextValue = (response: FormResponse) => {
    const value = response.value;
    
    if (!value || value.trim() === '') {
      return (
        <span className="text-muted-foreground italic text-sm">
          Não respondido
        </span>
      );
    }

    // Check if it's a URL (like LinkedIn)
    const isUrl = /^https?:\/\//.test(value);
    
    // Check if it's an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    
    // Check if it's a phone number
    const isPhone = /^[\d\s\(\)\-\+]+$/.test(value) && value.replace(/\D/g, '').length >= 8;

    if (isUrl) {
      return (
        <div className="flex items-center gap-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {value.length > 50 ? `${value.substring(0, 50)}...` : value}
            <ExternalLink className="h-3 w-3" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(value, 'Link')}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    if (isEmail) {
      return (
        <div className="flex items-center gap-2">
          <a
            href={`mailto:${value}`}
            className="text-sm text-primary hover:underline"
          >
            {value}
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(value, 'E-mail')}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    if (isPhone) {
      return (
        <div className="flex items-center gap-2">
          <a
            href={`tel:${value}`}
            className="text-sm hover:underline"
          >
            {value}
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(value, 'Telefone')}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // Long text handling
    const needsExpansion = isLongText(value);
    const isExpanded = expandedFields.has(response.fieldId);

    if (needsExpansion) {
      return (
        <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(response.fieldId)}>
          <div className="text-sm text-foreground">
            {!isExpanded && (
              <p className="line-clamp-3">{value}</p>
            )}
            <CollapsibleContent>
              <p className="whitespace-pre-wrap">{value}</p>
            </CollapsibleContent>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-1 h-auto py-1 px-2 text-xs">
              {isExpanded ? (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Mostrar mais
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      );
    }

    return (
      <p className="text-sm text-foreground whitespace-pre-wrap">
        {value}
      </p>
    );
  };

  // Helper to render candidate fallback data
  const renderCandidateFallback = () => {
    if (!candidate) return null;

    const candidateFields = [
      { 
        id: 'name', 
        label: 'Nome Completo', 
        value: candidate.name, 
        icon: User,
        type: 'text' 
      },
      { 
        id: 'email', 
        label: 'E-mail', 
        value: candidate.email, 
        icon: Mail,
        type: 'email' 
      },
      { 
        id: 'phone', 
        label: 'Telefone', 
        value: candidate.phone, 
        icon: Phone,
        type: 'phone' 
      },
      { 
        id: 'linkedin', 
        label: 'LinkedIn', 
        value: candidate.linkedinUrl, 
        icon: Linkedin,
        type: 'url' 
      },
      { 
        id: 'resume', 
        label: 'Currículo', 
        value: candidate.resumeUrl, 
        icon: FileText,
        type: 'file' 
      },
    ].filter(f => f.value);

    return (
      <div className="space-y-4">
        {candidateFields.map((field) => {
          const IconComponent = field.icon;
          
          return (
            <div
              key={field.id}
              className="border rounded-lg p-4 bg-card"
            >
              {/* Field Label */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-sm">{field.label}</p>
                </div>
              </div>

              {/* Field Value */}
              {field.type === 'email' && (
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${field.value}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {field.value}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(field.value!, 'E-mail')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {field.type === 'phone' && (
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${field.value}`}
                    className="text-sm hover:underline"
                  >
                    {field.value}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(field.value!, 'Telefone')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {field.type === 'url' && (
                <div className="flex items-center gap-2">
                  <a
                    href={field.value!.startsWith('http') ? field.value! : `https://${field.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {field.value!.length > 50 ? `${field.value!.substring(0, 50)}...` : field.value}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(field.value!, 'Link')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {field.type === 'text' && (
                <p className="text-sm text-foreground">{field.value}</p>
              )}
              
              {field.type === 'file' && field.value && (
                <FileFieldRenderer fileUrl={field.value} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // If we have form responses, render them
  if (hasFormResponses) {
    return (
      <div className="space-y-4">
        {responses.map((response) => {
          const isFileField = response.fieldType === 'file_upload';
          const isYesNo = response.fieldType === 'yes_no';

          return (
            <div
              key={response.id}
              className="border rounded-lg p-4 bg-card"
            >
              {/* Field Label */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="font-medium text-sm">{response.label}</p>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {getFieldTypeLabel(response.fieldType)}
                </Badge>
              </div>

              {/* Field Value */}
              {isFileField ? (
                renderFileField(response)
              ) : isYesNo ? (
                <Badge 
                  variant={response.value === 'sim' || response.value === 'yes' ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {response.value === 'sim' || response.value === 'yes' ? 'Sim' : 'Não'}
                </Badge>
              ) : (
                renderTextValue(response)
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback: show candidate data
  return renderCandidateFallback();
}