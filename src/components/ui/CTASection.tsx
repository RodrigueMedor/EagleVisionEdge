import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CTASectionProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  background?: 'primary' | 'accent' | 'gradient'
}

export default function CTASection({
  title,
  description,
  children,
  className,
  background = 'primary'
}: CTASectionProps) {
  const backgrounds = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    gradient: 'bg-gradient-to-r from-primary to-secondary'
  }

  return (
    <div className={cn(backgrounds[background], 'py-16', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {children && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
