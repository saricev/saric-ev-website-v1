import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({ title, subtitle, centered = true, className }: SectionTitleProps) {
  return (
    <div className={cn(centered && 'text-center', 'mb-12', className)}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
