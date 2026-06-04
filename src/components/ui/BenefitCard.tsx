import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BenefitCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  accent?: boolean
}

export default function BenefitCard({
  icon: Icon, title, description, className, accent = false
}: BenefitCardProps) {
  return (
    <div className={cn(
      'p-6 lg:p-8 rounded-2xl transition-all duration-300 group',
      accent
        ? 'bg-gradient-to-br from-accent to-red-700 text-white shadow-lg'
        : 'bg-white border border-gray-100 shadow-soft hover:shadow-xl hover:-translate-y-0.5',
      className
    )}>
      <div className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110',
        accent ? 'bg-white/20' : 'bg-primary/5'
      )}>
        <Icon className={cn('w-6 h-6', accent ? 'text-white' : 'text-primary')} />
      </div>
      <h3 className={cn('text-xl font-bold mb-2', accent ? 'text-white' : 'text-primary')}>
        {title}
      </h3>
      <p className={cn('leading-relaxed text-sm', accent ? 'text-gray-100' : 'text-gray-500')}>
        {description}
      </p>
    </div>
  )
}
