import { useState, useEffect } from 'react'
import { DollarSign, Calculator, TrendingUp, CreditCard, AlertCircle, CheckCircle, Info, Loader2 } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { AIRecommendation } from '@/types/ai'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface AIFinancingAssistantProps {
  vehiclePrice?: number
  className?: string
}

export default function AIFinancingAssistant({ vehiclePrice, className }: AIFinancingAssistantProps) {
  const [creditScore, setCreditScore] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [loanTerm, setLoanTerm] = useState('60')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [estimatedPayment, setEstimatedPayment] = useState<number | null>(null)
  const [approvalChance, setApprovalChance] = useState<string>('')
  const [showResults, setShowResults] = useState(false)

  const loanTerms = [
    { value: '36', label: '36 months' },
    { value: '48', label: '48 months' },
    { value: '60', label: '60 months' },
    { value: '72', label: '72 months' },
    { value: '84', label: '84 months' }
  ]

  const creditRanges = [
    { value: '750+', label: 'Excellent (750+)' },
    { value: '700-749', label: 'Good (700-749)' },
    { value: '650-699', label: 'Fair (650-699)' },
    { value: '600-649', label: 'Poor (600-649)' },
    { value: '600-', label: 'Very Poor (below 600)' }
  ]

  useEffect(() => {
    if (vehiclePrice) {
      setDownPayment(String(Math.round(vehiclePrice * 0.2)))
    }
  }, [vehiclePrice])

  const calculateFinancing = async () => {
    if (!vehiclePrice || !creditScore || !downPayment || !loanTerm) return

    setIsCalculating(true)
    try {
      // Get financing recommendations
      const score = parseInt(creditScore.replace(/[^\d]/g, '')) || 0
      const response = await aiService.getFinancingRecommendations(score)
      
      if (response.success && response.data) {
        setRecommendations(response.data)
      }

      // Calculate estimated payment
      const price = vehiclePrice
      const down = parseFloat(downPayment) || 0
      const principal = price - down
      const months = parseInt(loanTerm)
      
      // Mock interest rate based on credit score
      let interestRate = 0
      if (score >= 750) interestRate = 0.049
      else if (score >= 700) interestRate = 0.059
      else if (score >= 650) interestRate = 0.079
      else if (score >= 600) interestRate = 0.099
      else interestRate = 0.129

      const monthlyRate = interestRate / 12
      const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1)
      
      setEstimatedPayment(Math.round(payment))

      // Calculate approval chance
      if (score >= 750) setApprovalChance('Excellent (95%+)')
      else if (score >= 700) setApprovalChance('Good (80-95%)')
      else if (score >= 650) setApprovalChance('Fair (60-80%)')
      else if (score >= 600) setApprovalChance('Poor (30-60%)')
      else setApprovalChance('Low (10-30%)')

      setShowResults(true)
    } catch (error) {
      console.error('Failed to calculate financing:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const getApprovalColor = (chance: string) => {
    if (chance.includes('Excellent')) return 'text-green-600'
    if (chance.includes('Good')) return 'text-blue-600'
    if (chance.includes('Fair')) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const resetCalculation = () => {
    setCreditScore('')
    setDownPayment('')
    setLoanTerm('60')
    setMonthlyIncome('')
    setRecommendations([])
    setEstimatedPayment(null)
    setApprovalChance('')
    setShowResults(false)
  }

  return (
    <Card className={clsx("p-6", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Financing Assistant</h3>
          <p className="text-sm text-gray-600">Get personalized financing recommendations</p>
        </div>

        {!showResults ? (
          <>
            {/* Vehicle Price Display */}
            {vehiclePrice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Vehicle Price:</span>
                  <span className="text-lg font-bold text-blue-900">{formatCurrency(vehiclePrice)}</span>
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Score Range
                </label>
                <Select
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select your credit range</option>
                  {creditRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment
                  </label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="0"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term
                  </label>
                  <Select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full"
                  >
                    {loanTerms.map((term) => (
                      <option key={term.value} value={term.value}>
                        {term.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income (Optional)
                </label>
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateFinancing}
              disabled={!creditScore || !downPayment || !loanTerm || isCalculating}
              variant="primary"
              className="w-full"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Financing Options
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(estimatedPayment || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approval Chance</p>
                    <p className={clsx("text-lg font-bold", getApprovalColor(approvalChance))}>
                      {approvalChance}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Vehicle Price:</span>
                      <span className="ml-2 font-medium">{formatCurrency(vehiclePrice || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Down Payment:</span>
                      <span className="ml-2 font-medium">{formatCurrency(parseFloat(downPayment) || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="ml-2 font-medium">
                        {formatCurrency((vehiclePrice || 0) - (parseFloat(downPayment) || 0))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Loan Term:</span>
                      <span className="ml-2 font-medium">{loanTerm} months</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Options</h4>
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{rec.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            {rec.metadata && (
                              <div className="mt-2 text-sm">
                                {rec.metadata.apr && (
                                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                                    APR: {rec.metadata.apr}%
                                  </span>
                                )}
                                {rec.metadata.term && (
                                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Term: {rec.metadata.term} months
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {rec.metadata?.recommended && (
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Recommended
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <Button variant="secondary" onClick={resetCalculation}>
                  Recalculate
                </Button>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-800 mb-1">Important Information</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• This is an estimate based on the information provided</li>
                      <li>• Actual rates and terms may vary based on credit history</li>
                      <li>• Subject to lender approval and verification</li>
                      <li>• Additional fees and taxes may apply</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
