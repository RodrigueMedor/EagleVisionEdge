import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: ReactNode
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 6,
  className = ''
}: ResponsiveGridProps) {
  const gridClasses = [
    'grid',
    `gap-${gap}`,
    cols.xs && `grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  ].filter(Boolean).join(' ')

  return <div className={gridClasses}>{children}</div>
}

interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function ResponsiveCard({ children, className = '', hover = true }: ResponsiveCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden',
      hover && 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-soft">
      <table className={`min-w-full divide-y divide-gray-100 ${className}`}>
        {children}
      </table>
    </div>
  )
}

interface ResponsiveTableHeaderProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTableHeader({ children, className = '' }: ResponsiveTableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      <tr>{children}</tr>
    </thead>
  )
}

interface ResponsiveTableBodyProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTableBody({ children, className = '' }: ResponsiveTableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-100 ${className}`}>
      {children}
    </tbody>
  )
}

interface ResponsiveTableRowProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function ResponsiveTableRow({ children, className = '', hover = true }: ResponsiveTableRowProps) {
  return (
    <tr className={cn(
      hover && 'hover:bg-gray-50/50',
      'transition-colors duration-150',
      className
    )}>
      {children}
    </tr>
  )
}

interface ResponsiveTableCellProps {
  children: ReactNode
  className?: string
  nowrap?: boolean
}

export function ResponsiveTableCell({ children, className = '', nowrap = false }: ResponsiveTableCellProps) {
  return (
    <td className={cn(
      'px-6 py-4 text-sm text-gray-900',
      !nowrap && 'whitespace-normal',
      className
    )}>
      {children}
    </td>
  )
}

interface ResponsiveTableHeaderCellProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTableHeaderCell({ children, className = '' }: ResponsiveTableHeaderCellProps) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${className}`}>
      {children}
    </th>
  )
}
