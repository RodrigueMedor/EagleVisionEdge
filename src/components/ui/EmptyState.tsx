import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { Car, Users, FileText, DollarSign, Calendar, Settings, Search, Inbox } from 'lucide-react'

interface EmptyStateProps {
  type: 'vehicles' | 'leads' | 'customers' | 'financing' | 'rentals' | 'analytics' | 'settings' | 'search' | 'general'
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ type, title, description, action, className }: EmptyStateProps) {
  const icons = {
    vehicles: Car, leads: Users, customers: Users, financing: DollarSign,
    rentals: Calendar, analytics: FileText, settings: Settings, search: Search, general: Inbox,
  }

  const colors: Record<string, string> = {
    vehicles: 'text-primary bg-primary/5',
    leads: 'text-accent bg-accent/5',
    customers: 'text-gold bg-gold/5',
    financing: 'text-gold bg-gold/5',
    rentals: 'text-accent bg-accent/5',
    analytics: 'text-primary bg-primary/5',
    settings: 'text-gray-400 bg-gray-100',
    search: 'text-accent bg-accent/5',
    general: 'text-gray-400 bg-gray-100',
  }

  const Icon = icons[type]

  return (
    <div className={clsx('text-center py-16', className)}>
      <div className={clsx('inline-flex items-center justify-center w-20 h-20 rounded-2xl', colors[type])}>
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-primary">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
