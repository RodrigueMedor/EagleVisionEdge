import { SelectHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: Array<{ value: string | number; label: string }>
  children?: ReactNode
}

export default function Select({ label, error, options, children, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-primary mb-2">
          {label}
          {props.required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-4 py-2 border rounded-lg transition-smooth',
          'focus:ring-2 focus:ring-primary focus:border-transparent',
          error ? 'border-accent' : 'border-gray-300',
          className
        )}
        {...props}
      >
        {!children && <option value="">Select an option</option>}
        {options ? options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )) : children}
      </select>
      {error && <p className="text-accent text-sm mt-1">{error}</p>}
    </div>
  )
}

