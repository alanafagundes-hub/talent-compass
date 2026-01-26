import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bold, Italic, Underline, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

// Common emojis for job descriptions
const EMOJI_CATEGORIES = [
  {
    name: "Trabalho",
    emojis: ["💼", "📊", "💡", "🎯", "🚀", "⭐", "✨", "🏆", "📈", "💪"],
  },
  {
    name: "Comunicação",
    emojis: ["💬", "📧", "📱", "🤝", "👋", "✅", "❌", "⚡", "🔥", "💯"],
  },
  {
    name: "Técnico",
    emojis: ["💻", "🖥️", "⚙️", "🔧", "🛠️", "📁", "📋", "🔍", "🔒", "🌐"],
  },
  {
    name: "Pessoas",
    emojis: ["👤", "👥", "🧑‍💼", "👨‍💻", "👩‍💻", "🎓", "📚", "🎨", "🎬", "🎤"],
  },
];

interface RichTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function RichTextarea({ 
  value, 
  onChange, 
  className,
  label,
  ...props 
}: RichTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  // Get current selection
  const getSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: "" };
    
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      text: value.substring(textarea.selectionStart, textarea.selectionEnd),
    };
  }, [value]);

  // Insert text at cursor or wrap selection
  const insertText = useCallback((before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end, text } = getSelection();
    
    let newValue: string;
    let newCursorPos: number;

    if (text) {
      // Wrap selected text
      newValue = value.substring(0, start) + before + text + after + value.substring(end);
      newCursorPos = start + before.length + text.length + after.length;
    } else {
      // Insert at cursor
      newValue = value.substring(0, start) + before + after + value.substring(end);
      newCursorPos = start + before.length;
    }

    onChange(newValue);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange, getSelection]);

  // Format handlers
  const handleBold = () => insertText("**", "**");
  const handleItalic = () => insertText("*", "*");
  const handleUnderline = () => insertText("<u>", "</u>");
  
  const handleEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = getSelection();
    const newValue = value.substring(0, start) + emoji + value.substring(end);
    
    onChange(newValue);
    setIsEmojiOpen(false);
    
    // Restore focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return (
    <div className="space-y-2">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-md border border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-8 w-8 p-0"
          title="Negrito (**texto**)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-8 w-8 p-0"
          title="Itálico (*texto*)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnderline}
          className="h-8 w-8 p-0"
          title="Sublinhado"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Inserir emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <div className="space-y-3">
              {EMOJI_CATEGORIES.map((category) => (
                <div key={category.name}>
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                    {category.name}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {category.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmoji(emoji)}
                        className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <span className="text-xs text-muted-foreground ml-auto pr-2">
          Selecione texto para formatar
        </span>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("min-h-[120px] resize-y", className)}
        {...props}
      />
    </div>
  );
}
