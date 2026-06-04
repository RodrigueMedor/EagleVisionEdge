import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 inline-flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-primary hover:bg-secondary text-white focus-visible:outline-primary disabled:bg-gray-300 hover:shadow-lg active:scale-[0.97]',
    secondary: 'bg-white hover:bg-gray-50 text-primary border border-gray-200 focus-visible:outline-primary disabled:bg-gray-100 disabled:text-gray-400 hover:border-gray-300 hover:shadow-sm active:scale-[0.97]',
    accent: 'bg-accent hover:bg-red-700 text-white focus-visible:outline-accent disabled:bg-red-900 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.97]',
    ghost: 'bg-transparent hover:bg-gray-100 text-primary focus-visible:outline-primary disabled:text-gray-400 active:scale-[0.97]',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus-visible:outline-red-600 disabled:bg-red-400 hover:shadow-lg active:scale-[0.97]',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className, {
        'opacity-50 cursor-not-allowed': disabled || isLoading,
      })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
