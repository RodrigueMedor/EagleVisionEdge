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
  icon: Icon,
  title,
  description,
  className,
  accent = false
}: BenefitCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-xl transition-all duration-300 hover:scale-105',
      accent 
        ? 'bg-gradient-to-br from-accent to-red-700 text-white shadow-lg' 
        : 'bg-white shadow-lg hover:shadow-xl',
      className
    )}>
      <Icon className={cn(
        'w-10 h-10 mb-4',
        accent ? 'text-white' : 'text-accent'
      )} />
      <h3 className={cn(
        'text-xl font-bold mb-2',
        accent ? 'text-white' : 'text-primary'
      )}>
        {title}
      </h3>
      <p className={cn(
        'leading-relaxed',
        accent ? 'text-gray-100' : 'text-gray-600'
      )}>
        {description}
      </p>
    </div>
  )
}
