import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, Download, ExternalLink } from "lucide-react";
import type { FormResponse } from "@/hooks/useFunnelData";

interface FormResponsesBlockProps {
  responses: FormResponse[];
}

export default function FormResponsesBlock({ responses }: FormResponsesBlockProps) {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  if (!responses || responses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma resposta de formulário registrada.
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
      short_text: "Texto curto",
      long_text: "Texto longo",
      multiple_choice: "Múltipla escolha",
      yes_no: "Sim/Não",
      file_upload: "Arquivo",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-3">
      {responses.map((response) => {
        const isExpanded = expandedFields.has(response.fieldId);
        const needsExpansion = isLongText(response.value);

        return (
          <div
            key={response.id}
            className="border rounded-lg p-3 bg-muted/20"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-medium text-sm">{response.label}</p>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {getFieldTypeLabel(response.fieldType)}
              </Badge>
            </div>

            {response.fieldType === "file_upload" && response.fileUrl ? (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a
                  href={response.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Visualizar arquivo
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={response.fileUrl}
                  download
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ) : response.fieldType === "yes_no" ? (
              <Badge variant={response.value === "yes" ? "default" : "secondary"}>
                {response.value === "yes" ? "Sim" : "Não"}
              </Badge>
            ) : needsExpansion ? (
              <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(response.fieldId)}>
                <div className="text-sm text-foreground">
                  {!isExpanded && (
                    <p className="line-clamp-2">{response.value}</p>
                  )}
                  <CollapsibleContent>
                    <p className="whitespace-pre-wrap">{response.value}</p>
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
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {response.value || <span className="text-muted-foreground italic">Não respondido</span>}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
