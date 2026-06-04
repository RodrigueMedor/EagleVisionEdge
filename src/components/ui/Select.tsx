import { SelectHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
  options?: Array<{ value: string | number; label: string }>
  children?: ReactNode
}

export default function Select({ label, error, options, children, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-primary mb-1.5">
          {label}
          {props.required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={clsx(
            'w-full px-4 py-2.5 border rounded-xl transition-all duration-200 appearance-none',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none',
            error
              ? 'border-accent focus:ring-accent/20 focus:border-accent'
              : 'border-gray-200 hover:border-gray-300',
            className
          )}
          {...props}
        >
          {!children && <option value="">{props.placeholder || 'Select an option'}</option>}
          {options ? options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )) : children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-accent text-sm mt-1.5">{error}</p>}
    </div>
  )
}
