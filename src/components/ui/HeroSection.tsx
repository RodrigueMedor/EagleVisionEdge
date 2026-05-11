import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  children?: ReactNode
  className?: string
  background?: 'gradient' | 'white' | 'gray'
}

export default function HeroSection({
  title,
  subtitle,
  description,
  children,
  className,
  background = 'gradient'
}: HeroSectionProps) {
  const backgrounds = {
    gradient: 'bg-gradient-to-br from-primary to-secondary',
    white: 'bg-white',
    gray: 'bg-gray-50'
  }

  const textColors = {
    gradient: 'text-white',
    white: 'text-primary',
    gray: 'text-primary'
  }

  const subtitleColors = {
    gradient: 'text-gray-200',
    white: 'text-gray-600',
    gray: 'text-gray-600'
  }

  return (
    <div className={cn(backgrounds[background], 'py-16 md:py-24', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={cn('text-4xl md:text-5xl lg:text-6xl font-bold mb-6', textColors[background])}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn('text-xl md:text-2xl mb-4 font-semibold', subtitleColors[background])}>
              {subtitle}
            </p>
          )}
          {description && (
            <p className={cn('text-lg max-w-3xl mx-auto mb-8', subtitleColors[background])}>
              {description}
            </p>
          )}
          {children && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
