import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  children?: ReactNode
  className?: string
  background?: 'gradient' | 'white' | 'gray'
  image?: string
}

export default function HeroSection({
  title, subtitle, description, children, className, background = 'gradient', image
}: HeroSectionProps) {
  const backgrounds = {
    gradient: 'bg-gradient-to-br from-primary via-secondary to-primary text-white',
    white: 'bg-white text-primary',
    gray: 'bg-gray-50 text-primary',
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {image ? (
        <div className="relative min-h-[60vh] flex items-center">
          <div className="absolute inset-0">
            <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/20" />
          </div>
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-gold/10 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative w-full">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl md:text-2xl mb-4 font-semibold text-gray-200">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-lg max-w-3xl mx-auto mb-8 leading-relaxed text-gray-300">
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
      ) : (
        <div className={cn(backgrounds[background], 'relative overflow-hidden', className)}>
          {background === 'gradient' && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-gold/5" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            </>
          )}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
            <div className="text-center">
              <h1 className={cn('text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight', background === 'gradient' ? 'text-white' : 'text-primary')}>
                {title}
              </h1>
              {subtitle && (
                <p className={cn('text-xl md:text-2xl mb-4 font-semibold', background === 'gradient' ? 'text-gray-200' : 'text-gray-600')}>
                  {subtitle}
                </p>
              )}
              {description && (
                <p className={cn('text-lg max-w-3xl mx-auto mb-8 leading-relaxed', background === 'gradient' ? 'text-gray-300' : 'text-gray-600')}>
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
      )}
    </div>
  )
}
