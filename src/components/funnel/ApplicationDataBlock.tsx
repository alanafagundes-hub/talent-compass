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
} from "lucide-react";
import { toast } from "sonner";
import type { FormResponse } from "@/hooks/useFunnelData";

interface ApplicationDataBlockProps {
  responses: FormResponse[];
}

export default function ApplicationDataBlock({ responses }: ApplicationDataBlockProps) {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!responses || responses.length === 0) {
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

  const renderFileField = (response: FormResponse) => {
    const fileUrl = response.fileUrl || response.value;
    
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
              onClick={() => setPreviewUrl(previewUrl === fileUrl ? null : fileUrl)}
            >
              <Eye className="h-4 w-4" />
              {previewUrl === fileUrl ? 'Ocultar' : 'Visualizar'}
            </Button>
            {/* External Link */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={fileUrl} download title="Baixar arquivo">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* PDF Preview */}
        {previewUrl === fileUrl && isPdf && (
          <div className="border rounded-lg overflow-hidden bg-muted/30">
            <iframe
              src={`${fileUrl}#view=FitH`}
              className="w-full h-[400px]"
              title={`Preview de ${fileName}`}
            />
          </div>
        )}

        {/* Non-PDF File Preview Message */}
        {previewUrl === fileUrl && !isPdf && (
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