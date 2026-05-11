import { clsx } from 'clsx'

interface StatusBadgeProps {
  status: string
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'available' | 'sold' | 'pending' | 'active' | 'inactive' | 'new' | 'contacted' | 'appointment_scheduled' | 'financing_pending' | 'negotiation' | 'closed'
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({ status, variant = 'info', size = 'md', className }: StatusBadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    available: 'bg-green-100 text-green-800 border-green-200',
    sold: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    new: 'bg-purple-100 text-purple-800 border-purple-200',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    appointment_scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    financing_pending: 'bg-orange-100 text-orange-800 border-orange-200',
    negotiation: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium border',
      variants[variant],
      sizes[size],
      className
    )}>
      <span className="w-2 h-2 rounded-full bg-current mr-2 opacity-60"></span>
      {status}
    </span>
  )
}
