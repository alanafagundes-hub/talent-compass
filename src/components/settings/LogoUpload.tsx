import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, ImageIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoDot from "@/assets/logo-dot.png";

interface LogoUploadProps {
  currentLogoUrl: string;
  onLogoChange: (url: string) => void;
  disabled?: boolean;
}

const ALLOWED_TYPES = ["image/svg+xml", "image/png"];
const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function LogoUpload({ currentLogoUrl, onLogoChange, disabled = false }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasCustomLogo = previewUrl && previewUrl !== "" && !previewUrl.includes("logo-dot");

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Formato inválido. Use SVG ou PNG.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `Arquivo muito grande. Máximo: ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      // Delete old logo if exists (and it's not the default)
      if (hasCustomLogo && currentLogoUrl) {
        try {
          const oldPath = currentLogoUrl.split("/landing-logos/")[1];
          if (oldPath) {
            await supabase.storage.from("landing-logos").remove([oldPath]);
          }
        } catch (e) {
          // Ignore deletion errors
          console.warn("Could not delete old logo:", e);
        }
      }

      // Upload new logo
      const { data, error: uploadError } = await supabase.storage
        .from("landing-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("landing-logos")
        .getPublicUrl(data.path);

      const newUrl = urlData.publicUrl;
      setPreviewUrl(newUrl);
      onLogoChange(newUrl);
      toast.success("Logo enviado com sucesso!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erro ao enviar logo. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    if (!hasCustomLogo) return;

    setIsUploading(true);

    try {
      // Delete from storage
      if (currentLogoUrl) {
        const path = currentLogoUrl.split("/landing-logos/")[1];
        if (path) {
          await supabase.storage.from("landing-logos").remove([path]);
        }
      }

      // Reset to empty (will use default DOT logo)
      setPreviewUrl("");
      onLogoChange("");
      toast.success("Logo removido. O logo padrão será usado.");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Erro ao remover logo.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const displayLogoSrc = previewUrl || logoDot;

  return (
    <div className="space-y-3">
      <Label>Logo da Empresa</Label>
      <p className="text-sm text-muted-foreground">
        Formatos: SVG (preferencial) ou PNG. Tamanho máximo: 1MB. Fundo transparente recomendado.
      </p>

      <div className="flex items-start gap-4">
        {/* Logo Preview */}
        <div className="shrink-0 h-20 w-20 rounded-lg border border-border bg-muted/30 flex items-center justify-center overflow-hidden">
          {previewUrl || !hasCustomLogo ? (
            <img
              src={displayLogoSrc}
              alt="Logo preview"
              className="max-h-16 max-w-16 object-contain"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,image/svg+xml,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {!hasCustomLogo ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileSelect}
              disabled={disabled || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Enviar logo
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={triggerFileSelect}
                disabled={disabled || isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Substituir logo
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveLogo}
                disabled={disabled || isUploading}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
                Remover logo
              </Button>
            </>
          )}

          {!hasCustomLogo && (
            <p className="text-xs text-muted-foreground">
              Usando logo padrão da DOT
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
