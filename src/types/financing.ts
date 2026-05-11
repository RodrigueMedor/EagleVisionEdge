export interface FinancingApplication {
  id?: string
  customerName?: string
  customerEmail?: string
  fullName: string
  email: string
  phone: string
  vehicleInterested: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: number
  vehicleVin?: string
  downPayment: string | number
  loanAmount?: number
  creditScore: CreditScoreRange
  monthlyIncome: string
  employmentStatus: EmploymentStatus
  loanTerm?: string
  message: string
  createdAt?: string | Date
  status?: 'pending' | 'approved' | 'rejected' | 'review'
}

export interface PaymentCalculation {
  vehiclePrice: number
  downPayment: number
  interestRate: number
  loanTerm: number
  monthlyPayment: number
  totalAmount: number
  totalInterest: number
}

export interface FinancingOption {
  id: string
  name: string
  apr: number
  termMonths: number
  downPaymentRequired: boolean
  creditScoreRequired: CreditScoreRange
  description: string
}

export interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  vehicleInterested?: string
  downPayment?: string
  monthlyIncome?: string
  message?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export type CreditScoreRange = 'excellent' | 'good' | 'fair' | 'poor' | ''
export type EmploymentStatus = 'employed-full' | 'employed-part' | 'self-employed' | 'retired' | 'other' | ''

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
