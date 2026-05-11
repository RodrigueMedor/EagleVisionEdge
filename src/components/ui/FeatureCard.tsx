import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  variant?: 'default' | 'gradient' | 'bordered'
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  variant = 'default'
}: FeatureCardProps) {
  const variants = {
    default: 'bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow',
    gradient: 'bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-white hover:shadow-xl transition-shadow',
    bordered: 'bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-primary transition-colors'
  }

  const iconVariants = {
    default: 'text-primary',
    gradient: 'text-white',
    bordered: 'text-primary'
  }

  const textVariants = {
    default: 'text-primary',
    gradient: 'text-white',
    bordered: 'text-primary'
  }

  const descriptionVariants = {
    default: 'text-gray-600',
    gradient: 'text-gray-200',
    bordered: 'text-gray-600'
  }

  return (
    <div className={cn(variants[variant], className)}>
      <Icon className={cn('w-12 h-12 mb-4', iconVariants[variant])} />
      <h3 className={cn('text-xl font-bold mb-2', textVariants[variant])}>
        {title}
      </h3>
      <p className={cn('leading-relaxed', descriptionVariants[variant])}>
        {description}
      </p>
    </div>
  )
}
