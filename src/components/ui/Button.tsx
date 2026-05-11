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
  const baseStyles = 'font-semibold transition-smooth rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2'

  const variants = {
    primary: 'bg-primary hover:bg-secondary text-white focus-visible:outline-primary disabled:bg-gray-400',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-primary focus-visible:outline-primary disabled:bg-gray-300',
    accent: 'bg-accent hover:bg-red-700 text-white focus-visible:outline-accent disabled:bg-red-900',
    ghost: 'bg-transparent hover:bg-gray-100 text-primary focus-visible:outline-primary disabled:text-gray-400',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus-visible:outline-red-600 disabled:bg-red-400',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
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

