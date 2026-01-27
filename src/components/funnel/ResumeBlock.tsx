import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResumeBlockProps {
  resumeUrl?: string;
  candidateName: string;
}

export default function ResumeBlock({ resumeUrl, candidateName }: ResumeBlockProps) {
  const [showPreview, setShowPreview] = useState(false);

  if (!resumeUrl) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum currículo anexado.
      </p>
    );
  }

  // Extract filename from URL
  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      // Decode URI and limit length
      const decoded = decodeURIComponent(fileName);
      return decoded.length > 40 ? decoded.slice(0, 37) + '...' : decoded;
    } catch {
      return 'Currículo';
    }
  };

  const isPdf = resumeUrl.toLowerCase().includes('.pdf');

  return (
    <>
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
        <div className="p-2 rounded bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{getFileName(resumeUrl)}</p>
          <p className="text-xs text-muted-foreground">Currículo do candidato</p>
        </div>
        <div className="flex items-center gap-1">
          {isPdf && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowPreview(true)}
              title="Visualizar"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
            title="Abrir em nova aba"
          >
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
            title="Download"
          >
            <a href={resumeUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[85vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Currículo - {candidateName}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir em nova aba
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={resumeUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 p-4">
            <iframe
              src={resumeUrl}
              className="w-full h-full rounded border"
              title="Visualização do currículo"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
