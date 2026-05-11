import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import { clsx } from 'clsx'

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: Record<string, any>
  onFilterChange?: (filters: Record<string, any>) => void
  placeholder?: string
  className?: string
  showFilters?: boolean
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  filters = {},
  onFilterChange,
  placeholder = 'Search...',
  className,
  showFilters = true
}: SearchFilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleFilterChange = (key: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onFilterChange) {
      const newFilters = { ...filters, [key]: event.target.value }
      onFilterChange(newFilters)
    }
  }

  const clearFilters = () => {
    if (onFilterChange) {
      onFilterChange({} as Record<string, any>)
    }
  }

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '')

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {showFilters && (
          <Button
            variant="secondary"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={clsx('flex items-center gap-2', hasActiveFilters && 'bg-blue-50 text-blue-700 border-blue-200')}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filters).filter(v => v && v !== '').length}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Advanced Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              placeholder="Select Status"
              value={filters.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'sold', label: 'Sold' },
                { value: 'pending', label: 'Pending' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
            />
            
            <Select
              placeholder="Date Range"
              value={filters.dateRange || ''}
              onChange={(value) => handleFilterChange('dateRange', value)}
              options={[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'This Year' }
              ]}
            />
            
            <Select
              placeholder="Sort By"
              value={filters.sortBy || ''}
              onChange={(value) => handleFilterChange('sortBy', value)}
              options={[
                { value: 'date-desc', label: 'Newest First' },
                { value: 'date-asc', label: 'Oldest First' },
                { value: 'name-asc', label: 'Name (A-Z)' },
                { value: 'name-desc', label: 'Name (Z-A)' },
                { value: 'price-desc', label: 'Price (High-Low)' },
                { value: 'price-asc', label: 'Price (Low-High)' }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  )
}
