export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationInfo
}

export interface FilterOptions {
  search?: string
  status?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: (value: any) => string | null
  }
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'sales_rep' | 'staff'
  permissions: string[]
  avatar?: string
  phone?: string
  department?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  name?: string // Computed field
}

export interface LoadingState {
  isLoading: boolean
  loadingText?: string
}

export interface ErrorState {
  hasError: boolean
  error?: string
  errorDetails?: any
}

export interface ModalState {
  isOpen: boolean
  title?: string
  content?: any
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}
