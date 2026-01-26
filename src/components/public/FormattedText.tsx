import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

/**
 * Component that renders text with support for:
 * - Line breaks (whitespace-pre-wrap)
 * - Emojis (native support)
 * - Basic markdown-like formatting:
 *   - **bold** or __bold__
 *   - *italic* or _italic_
 *   - <u>underline</u> or __underline__ patterns
 */
export function FormattedText({ content, className = '' }: FormattedTextProps) {
  // Process the text to handle formatting
  const processText = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    // Pattern to match formatting markers
    // Bold: **text** or __text__
    // Italic: *text* or _text_
    const formatPattern = /(\*\*(.+?)\*\*|__(.+?)__|(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)|<u>(.+?)<\/u>)/g;

    let lastIndex = 0;
    let match;

    while ((match = formatPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={keyIndex++}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Determine which format was matched
      if (match[2]) {
        // **bold**
        parts.push(
          <strong key={keyIndex++} className="font-semibold text-foreground">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // __bold__
        parts.push(
          <strong key={keyIndex++} className="font-semibold text-foreground">
            {match[3]}
          </strong>
        );
      } else if (match[4]) {
        // *italic*
        parts.push(
          <em key={keyIndex++} className="italic">
            {match[4]}
          </em>
        );
      } else if (match[5]) {
        // _italic_
        parts.push(
          <em key={keyIndex++} className="italic">
            {match[5]}
          </em>
        );
      } else if (match[6]) {
        // <u>underline</u>
        parts.push(
          <span key={keyIndex++} className="underline">
            {match[6]}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={keyIndex++}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : [text];
  };

  // Split by newlines and process each line
  const lines = content.split('\n');
  
  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {processText(line)}
          {lineIndex < lines.length - 1 && '\n'}
        </React.Fragment>
      ))}
    </div>
  );
}
