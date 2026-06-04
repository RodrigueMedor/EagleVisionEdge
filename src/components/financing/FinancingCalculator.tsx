import { useState } from 'react'
import { Calculator, DollarSign, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { usePaymentCalculator } from '@/hooks/useFinancing'
import { useToast } from '@/hooks/useFinancing'

export default function FinancingCalculator() {
  const { calculation, isCalculating, showResult, calculatePayment, updateCalculationField } = usePaymentCalculator()
  const { showError, showSuccess } = useToast()

  const [inputErrors, setInputErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: string) => {
    const numValue = parseFloat(value)
    const errors: Record<string, string> = {}

    switch (field) {
      case 'vehiclePrice':
        if (!value || isNaN(numValue) || numValue <= 0) {
          errors.vehiclePrice = 'Vehicle price must be greater than 0'
        } else if (numValue > 1000000) {
          errors.vehiclePrice = 'Vehicle price seems too high'
        }
        break
      case 'downPayment':
        if (value && (isNaN(numValue) || numValue < 0)) {
          errors.downPayment = 'Down payment must be 0 or greater'
        } else if (numValue > calculation.vehiclePrice) {
          errors.downPayment = 'Down payment cannot exceed vehicle price'
        }
        break
      case 'interestRate':
        if (!value || isNaN(numValue) || numValue <= 0) {
          errors.interestRate = 'Interest rate must be greater than 0'
        } else if (numValue > 30) {
          errors.interestRate = 'Interest rate seems too high'
        }
        break
      case 'loanTerm':
        if (!value || isNaN(numValue) || numValue <= 0) {
          errors.loanTerm = 'Loan term must be greater than 0'
        } else if (numValue > 120) {
          errors.loanTerm = 'Loan term cannot exceed 120 months'
        }
        break
    }

    setInputErrors(prev => ({ ...prev, ...errors }))
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof typeof calculation, value: string) => {
    const numValue = parseFloat(value) || 0
    
    // Clear previous error for this field
    if (inputErrors[field]) {
      setInputErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    updateCalculationField(field, numValue)
    
    // Auto-validate on change
    validateField(field, value)
  }

  const handleCalculate = async () => {
    // Validate all fields
    const isVehiclePriceValid = validateField('vehiclePrice', calculation.vehiclePrice.toString())
    const isDownPaymentValid = validateField('downPayment', calculation.downPayment.toString())
    const isInterestRateValid = validateField('interestRate', calculation.interestRate.toString())
    const isLoanTermValid = validateField('loanTerm', calculation.loanTerm.toString())

    if (!isVehiclePriceValid || !isDownPaymentValid || !isInterestRateValid || !isLoanTermValid) {
      showError('Validation Error', 'Please correct the errors before calculating.')
      return
    }

    const result = await calculatePayment()
    
    if (result.success) {
      showSuccess('Calculation Complete', 'Your monthly payment has been calculated.')
    } else {
      showError('Calculation Failed', result.error || 'Failed to calculate payment. Please check your inputs.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const loanAmount = calculation.vehiclePrice - calculation.downPayment
  const downPaymentPercentage = calculation.vehiclePrice > 0 
    ? (calculation.downPayment / calculation.vehiclePrice * 100).toFixed(1)
    : '0'

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="w-8 h-8 text-primary mr-3" />
        <h3 className="text-2xl font-bold text-primary">Payment Calculator</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={calculation.vehiclePrice}
              onChange={(e) => handleInputChange('vehiclePrice', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                inputErrors.vehiclePrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="25000"
              min="0"
              max="1000000"
              step="100"
            />
          </div>
          {inputErrors.vehiclePrice && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {inputErrors.vehiclePrice}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment ({downPaymentPercentage}%)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={calculation.downPayment}
              onChange={(e) => handleInputChange('downPayment', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                inputErrors.downPayment ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="5000"
              min="0"
              max={calculation.vehiclePrice}
              step="100"
            />
          </div>
          {inputErrors.downPayment && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {inputErrors.downPayment}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (% APR)
          </label>
          <input
            type="number"
            value={calculation.interestRate}
            onChange={(e) => handleInputChange('interestRate', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              inputErrors.interestRate ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="6.5"
            min="0.1"
            max="30"
            step="0.1"
          />
          {inputErrors.interestRate && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {inputErrors.interestRate}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (months)
          </label>
          <select
            value={calculation.loanTerm}
            onChange={(e) => handleInputChange('loanTerm', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              inputErrors.loanTerm ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="36">36 months (3 years)</option>
            <option value="48">48 months (4 years)</option>
            <option value="60">60 months (5 years)</option>
            <option value="72">72 months (6 years)</option>
            <option value="84">84 months (7 years)</option>
            <option value="96">96 months (8 years)</option>
            <option value="120">120 months (10 years)</option>
          </select>
          {inputErrors.loanTerm && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {inputErrors.loanTerm}
            </div>
          )}
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={handleCalculate}
        isLoading={isCalculating}
        className="w-full mb-6"
      >
        Calculate Payment
      </Button>

      {showResult && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
            <p className="text-sm mb-2">Estimated Monthly Payment</p>
            <p className="text-3xl font-bold mb-4">
              {formatCurrency(calculation.monthlyPayment)}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-200">Loan Amount</p>
                <p className="font-semibold">{formatCurrency(loanAmount)}</p>
              </div>
              <div>
                <p className="text-gray-200">Total Amount</p>
                <p className="font-semibold">{formatCurrency(calculation.totalAmount)}</p>
              </div>
              <div>
                <p className="text-gray-200">Total Interest</p>
                <p className="font-semibold">{formatCurrency(calculation.totalInterest)}</p>
              </div>
              <div>
                <p className="text-gray-200">Term</p>
                <p className="font-semibold">{calculation.loanTerm} months</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              <strong>Disclaimer:</strong> This is an estimate only. Actual payments may vary based on credit score, taxes, fees, and lender requirements. Contact us for a personalized quote.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
