import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-primary mb-2">
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2 border rounded-lg transition-smooth',
            'focus:ring-2 focus:ring-primary focus:border-transparent',
            error ? 'border-accent' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="text-accent text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-600 text-sm mt-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

