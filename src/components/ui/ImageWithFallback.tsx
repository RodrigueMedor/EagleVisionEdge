import { useState } from 'react'
import { Car } from 'lucide-react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  aspectRatio?: string
}

export default function ImageWithFallback({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatio,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${containerClassName || className}`}>
        <Car className="w-10 h-10 text-gray-300 dark:text-gray-600" />
      </div>
    )
  }

  return (
    <div className={containerClassName} style={aspectRatio ? { aspectRatio } : undefined}>
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  )
}
