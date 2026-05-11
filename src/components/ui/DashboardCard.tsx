import { ReactNode } from 'react'
import { Card } from './Card'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: ReactNode
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange'
  className?: string
}

export function DashboardCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color, 
  className 
}: DashboardCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  }

  const ChangeIcon = changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : Minus
  const changeColor = changeType === 'increase' ? 'text-green-600' : changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'

  return (
    <Card className={clsx('relative overflow-hidden', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={clsx('flex items-center mt-2 text-sm', changeColor)}>
              <ChangeIcon className="w-4 h-4 mr-1" />
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={clsx('p-3 rounded-lg border', colorClasses[color])}>
          <div className={iconColorClasses[color]}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  )
}
