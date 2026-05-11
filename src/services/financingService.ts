import { FinancingApplication, PaymentCalculation, FinancingOption, ApiResponse } from '@/types/financing'

export class FinancingService {
  static async submitFinancingApplication(application: FinancingApplication): Promise<ApiResponse<FinancingApplication>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate random success/failure (90% success rate)
    const success = Math.random() > 0.1
    
    if (success) {
      const submittedApplication = {
        ...application,
        id: `app_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending' as const
      }
      
      return {
        success: true,
        data: submittedApplication,
        message: 'Application submitted successfully'
      }
    } else {
      return {
        success: false,
        error: 'Failed to submit application. Please try again.'
      }
    }
  }

  static async calculatePayment(calculation: Omit<PaymentCalculation, 'monthlyPayment' | 'totalAmount' | 'totalInterest'>): Promise<ApiResponse<PaymentCalculation>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const loanAmount = calculation.vehiclePrice - calculation.downPayment
    const monthlyRate = calculation.interestRate / 100 / 12
    const numPayments = calculation.loanTerm
    
    if (loanAmount <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      return {
        success: false,
        error: 'Invalid calculation parameters'
      }
    }
    
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                         (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    const totalAmount = monthlyPayment * numPayments
    const totalInterest = totalAmount - loanAmount
    
    return {
      success: true,
      data: {
        ...calculation,
        monthlyPayment,
        totalAmount,
        totalInterest
      }
    }
  }

  static async getFinancingOptions(): Promise<ApiResponse<FinancingOption[]>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const options: FinancingOption[] = [
      {
        id: 'opt_1',
        name: 'Standard Auto Loan',
        apr: 6.5,
        termMonths: 60,
        downPaymentRequired: true,
        creditScoreRequired: 'fair',
        description: 'Competitive rates for qualified buyers'
      },
      {
        id: 'opt_2',
        name: 'First-Time Buyer Program',
        apr: 7.9,
        termMonths: 72,
        downPaymentRequired: false,
        creditScoreRequired: 'fair',
        description: 'Special program for first-time car buyers'
      },
      {
        id: 'opt_3',
        name: 'Premium Financing',
        apr: 4.9,
        termMonths: 48,
        downPaymentRequired: true,
        creditScoreRequired: 'good',
        description: 'Best rates for excellent credit'
      }
    ]
    
    return {
      success: true,
      data: options
    }
  }

  static async requestInformation(email: string, message: string): Promise<ApiResponse<{ id: string }>> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      success: true,
      data: { id: `info_${Date.now()}` },
      message: 'Information request submitted. We will contact you within 24 hours.'
    }
  }

  static async getApplications(): Promise<FinancingApplication[]> {
    // Mock implementation - return empty array for now
    await new Promise(resolve => setTimeout(resolve, 300))
    return []
  }
}
