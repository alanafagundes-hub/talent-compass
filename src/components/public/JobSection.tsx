import { FormattedText } from './FormattedText';

interface JobSectionProps {
  title: string;
  content: string;
}

/**
 * Standardized section component for job detail page.
 * Ensures consistent typography and spacing across all sections.
 */
export function JobSection({ title, content }: JobSectionProps) {
  if (!content || !content.trim()) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-foreground tracking-tight">
        {title}
      </h3>
      <FormattedText 
        content={content} 
        className="text-muted-foreground text-base" 
      />
    </section>
  );
}
