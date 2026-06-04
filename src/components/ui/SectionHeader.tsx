import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
  centered?: boolean
}

export default function SectionHeader({
  title, subtitle, description, className, centered = true
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 lg:mb-14', centered && 'text-center', className)}>
      {subtitle && (
        <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-2 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
