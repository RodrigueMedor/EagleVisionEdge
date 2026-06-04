import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const colorMap: Record<string, string> = {
  primary: 'primary',
  accent: 'accent',
  gold: 'gold',
  blue: 'primary',
  green: 'accent',
  red: 'accent',
  yellow: 'gold',
  purple: 'primary',
  orange: 'gold',
}

interface DashboardCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: ReactNode
  color?: string
  className?: string
}

export function DashboardCard({
  title,
  value,
  change,
  changeType,
  icon,
  color = 'primary',
  className
}: DashboardCardProps) {
  const mappedColor = colorMap[color] || 'primary'
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white',
    accent: 'bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white',
    gold: 'bg-gold/5 text-gold group-hover:bg-gold group-hover:text-white',
  }

  const ChangeIcon = changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : Minus
  const changeColor = changeType === 'increase' ? 'text-green-600' : changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'

  return (
    <div className={clsx('group bg-white rounded-2xl border border-gray-100 p-6 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-primary mt-1">{value}</p>
          {change !== undefined && (
            <div className={clsx('flex items-center mt-2 text-xs font-medium', changeColor)}>
              <ChangeIcon className="w-3.5 h-3.5 mr-1" />
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={clsx('w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110', colorClasses[mappedColor])}>
          {icon}
        </div>
      </div>
    </div>
  )
}
