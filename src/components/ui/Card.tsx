import { ReactNode, CSSProperties } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export function Card({ children, className, hoverable, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 shadow-soft p-6',
        hoverable && 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface StatusBadgeProps {
  status: string
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
}

export function StatusBadge({ status, variant = 'info' }: StatusBadgeProps) {
  const variants = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-gray-50 text-gray-700 border-gray-200',
  }

  return (
    <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border', variants[variant])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 inline-block opacity-60" />
      {status}
    </span>
  )
}

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  count?: number
}

export function Skeleton({ width = '100%', height = '20px', className, count = 1 }: SkeletonProps) {
  const style: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx('bg-gray-100 rounded-xl animate-pulse', className)}
          style={style}
        />
      ))}
    </>
  )
}
