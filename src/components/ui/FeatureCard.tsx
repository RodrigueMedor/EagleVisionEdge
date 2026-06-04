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
  icon: Icon, title, description, className, variant = 'default'
}: FeatureCardProps) {
  const variants = {
    default: 'bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-soft hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
    gradient: 'bg-gradient-to-br from-primary to-secondary p-6 lg:p-8 rounded-2xl text-white hover:shadow-xl transition-all duration-300',
    bordered: 'bg-white p-6 lg:p-8 rounded-2xl border-2 border-gray-100 hover:border-primary/30 transition-all duration-300',
  }

  return (
    <div className={cn(variants[variant], 'group', className)}>
      <div className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110',
        variant === 'default' ? 'bg-primary/5' : variant === 'gradient' ? 'bg-white/20' : 'bg-primary/5'
      )}>
        <Icon className={cn('w-6 h-6', variant === 'gradient' ? 'text-white' : 'text-primary')} />
      </div>
      <h3 className={cn('text-xl font-bold mb-2', variant === 'gradient' ? 'text-white' : 'text-primary')}>
        {title}
      </h3>
      <p className={cn('leading-relaxed text-sm', variant === 'gradient' ? 'text-gray-200' : 'text-gray-500')}>
        {description}
      </p>
    </div>
  )
}
