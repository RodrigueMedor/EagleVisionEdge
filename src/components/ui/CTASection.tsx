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
  title, description, children, className, background = 'primary'
}: CTASectionProps) {
  const backgrounds = {
    primary: 'bg-gradient-to-br from-primary via-secondary to-primary',
    accent: 'bg-gradient-to-br from-accent to-red-700',
    gradient: 'bg-gradient-to-r from-primary to-secondary',
  }

  return (
    <div className={cn(backgrounds[background], 'relative overflow-hidden', className)}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center relative">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
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
