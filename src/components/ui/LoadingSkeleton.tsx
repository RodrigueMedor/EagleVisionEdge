import { clsx } from 'clsx'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  height?: string
}

export function LoadingSkeleton({ className, lines = 3, height = 'h-4' }: LoadingSkeletonProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'bg-gray-200 rounded animate-pulse',
            height,
            i === lines - 1 && 'w-3/4' // Last line is shorter
          )}
        />
      ))}
    </div>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={clsx('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="h-3 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  className?: string
  showIcon?: boolean
}

export function CardSkeleton({ className, showIcon = true }: CardSkeletonProps) {
  return (
    <div className={clsx('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mb-3" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-40" />
        </div>
        {showIcon && (
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
        )}
      </div>
    </div>
  )
}
