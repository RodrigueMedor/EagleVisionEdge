import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
  centered?: boolean
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  className,
  centered = true
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-12',
      centered && 'text-center',
      className
    )}>
      {subtitle && (
        <h3 className="text-accent font-semibold text-lg mb-2">
          {subtitle}
        </h3>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
