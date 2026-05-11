import { useState, useCallback } from 'react'
import { FinancingApplication, PaymentCalculation, FormErrors, ToastNotification } from '@/types/financing'
import { FinancingService } from '@/services/financingService'

export function useFinancingForm() {
  const [formData, setFormData] = useState<FinancingApplication>({
    fullName: '',
    email: '',
    phone: '',
    vehicleInterested: '',
    downPayment: '',
    creditScore: '',
    monthlyIncome: '',
    employmentStatus: '',
    loanTerm: '60',
    message: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.downPayment && !/^\d+$/.test(String(formData.downPayment).replace(/[$,\s]/g, ''))) {
      newErrors.downPayment = 'Please enter a valid amount'
    }

    if (formData.monthlyIncome && !/^\d+$/.test(String(formData.monthlyIncome).replace(/[$,\s]/g, ''))) {
      newErrors.monthlyIncome = 'Please enter a valid amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await FinancingService.submitFinancingApplication(formData)
      
      if (response.success) {
        setSubmitted(true)
        return { success: true, data: response.data }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm])

  const resetForm = useCallback(() => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      vehicleInterested: '',
      downPayment: '',
      creditScore: '',
      monthlyIncome: '',
      employmentStatus: '',
      loanTerm: '60',
      message: ''
    })
    setErrors({})
    setSubmitted(false)
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    submitted,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm
  }
}

export function usePaymentCalculator() {
  const [calculation, setCalculation] = useState<PaymentCalculation>({
    vehiclePrice: 25000,
    downPayment: 5000,
    interestRate: 6.5,
    loanTerm: 60,
    monthlyPayment: 0,
    totalAmount: 0,
    totalInterest: 0
  })

  const [isCalculating, setIsCalculating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const calculatePayment = useCallback(async () => {
    setIsCalculating(true)
    
    try {
      const response = await FinancingService.calculatePayment({
        vehiclePrice: calculation.vehiclePrice,
        downPayment: calculation.downPayment,
        interestRate: calculation.interestRate,
        loanTerm: calculation.loanTerm
      })
      
      if (response.success && response.data) {
        setCalculation(response.data)
        setShowResult(true)
        return { success: true, data: response.data }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: 'Calculation failed' }
    } finally {
      setIsCalculating(false)
    }
  }, [calculation.vehiclePrice, calculation.downPayment, calculation.interestRate, calculation.loanTerm])

  const updateCalculationField = useCallback((field: keyof PaymentCalculation, value: number) => {
    setCalculation(prev => ({ ...prev, [field]: value }))
    setShowResult(false)
  }, [])

  return {
    calculation,
    isCalculating,
    showResult,
    calculatePayment,
    updateCalculationField
  }
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastNotification = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'success', title, message, duration })
  }, [addToast])

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'error', title, message, duration })
  }, [addToast])

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'warning', title, message, duration })
  }, [addToast])

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'info', title, message, duration })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev)
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden'
  }, [])

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  }
}
