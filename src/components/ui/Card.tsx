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
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        hoverable && 'hover:shadow-md transition-smooth cursor-pointer',
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
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', variants[variant])}>
      <span className="w-2 h-2 rounded-full bg-current mr-2 inline-block"></span>
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
          className={clsx('bg-gray-200 rounded animate-pulse', className)}
          style={style}
        />
      ))}
    </>
  )
}
