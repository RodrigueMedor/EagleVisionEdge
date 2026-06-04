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
          <label className="block text-sm font-semibold text-primary mb-1.5">
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 border rounded-xl transition-all duration-200',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none',
            'placeholder:text-gray-400',
            error
              ? 'border-accent focus:ring-accent/20 focus:border-accent'
              : 'border-gray-200 hover:border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="text-accent text-sm mt-1.5">{error}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1.5">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
