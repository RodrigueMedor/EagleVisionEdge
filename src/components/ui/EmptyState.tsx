import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { 
  Car, 
  Users, 
  FileText, 
  DollarSign, 
  Calendar, 
  Settings, 
  Search,
  Inbox,
  Package
} from 'lucide-react'

interface EmptyStateProps {
  type: 'vehicles' | 'leads' | 'customers' | 'financing' | 'rentals' | 'analytics' | 'settings' | 'search' | 'general'
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ type, title, description, action, className }: EmptyStateProps) {
  const icons = {
    vehicles: Car,
    leads: Users,
    customers: Users,
    financing: DollarSign,
    rentals: Calendar,
    analytics: FileText,
    settings: Settings,
    search: Search,
    general: Inbox
  }

  const colors = {
    vehicles: 'text-blue-500',
    leads: 'text-green-500',
    customers: 'text-purple-500',
    financing: 'text-yellow-500',
    rentals: 'text-orange-500',
    analytics: 'text-indigo-500',
    settings: 'text-gray-500',
    search: 'text-red-500',
    general: 'text-gray-500'
  }

  const bgColors = {
    vehicles: 'bg-blue-50',
    leads: 'bg-green-50',
    customers: 'bg-purple-50',
    financing: 'bg-yellow-50',
    rentals: 'bg-orange-50',
    analytics: 'bg-indigo-50',
    settings: 'bg-gray-50',
    search: 'bg-red-50',
    general: 'bg-gray-50'
  }

  const Icon = icons[type]

  return (
    <div className={clsx('text-center py-12', className)}>
      <div className={clsx('inline-flex items-center justify-center w-16 h-16 rounded-full', bgColors[type], colors[type])}>
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      
      {description && (
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}
