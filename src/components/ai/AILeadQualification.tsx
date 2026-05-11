import { useState, useEffect } from 'react'
import { User, DollarSign, Car, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { aiService } from '@/services/aiService'
import type { AILeadQualification, LeadQualificationRequest } from '@/types/ai'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface AILeadQualificationProps {
  customerId?: string
  onQualificationComplete?: (qualification: AILeadQualification) => void
  className?: string
}

export default function AILeadQualification({ 
  customerId, 
  onQualificationComplete,
  className 
}: AILeadQualificationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [qualification, setQualification] = useState<AILeadQualification | null>(null)
  const [answers, setAnswers] = useState({
    budget: '',
    vehicleType: '',
    financingNeeds: '',
    timeframe: '',
    creditScore: '',
    tradeIn: '',
    contactPreference: '',
    appointmentInterest: ''
  })
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [aiMessage, setAiMessage] = useState('')
  const [showResults, setShowResults] = useState(false)

  const qualificationSteps = [
    {
      id: 'budget',
      title: 'Budget Range',
      icon: DollarSign,
      question: 'What is your budget range for a vehicle?',
      type: 'select',
      options: [
        'Under $20,000',
        '$20,000 - $30,000',
        '$30,000 - $40,000',
        '$40,000 - $50,000',
        '$50,000 - $70,000',
        'Over $70,000'
      ]
    },
    {
      id: 'vehicleType',
      title: 'Vehicle Type',
      icon: Car,
      question: 'What type of vehicle are you looking for?',
      type: 'select',
      options: [
        'Sedan',
        'SUV',
        'Truck',
        'Coupe',
        'Convertible',
        'Minivan',
        'Electric Vehicle',
        'Hybrid'
      ]
    },
    {
      id: 'financingNeeds',
      title: 'Financing Needs',
      icon: DollarSign,
      question: 'Will you need financing assistance?',
      type: 'select',
      options: [
        'Yes, I need financing',
        'No, I\'m paying cash',
        'Maybe, depends on terms',
        'I have pre-approval'
      ]
    },
    {
      id: 'timeframe',
      title: 'Purchase Timeline',
      icon: Calendar,
      question: 'When are you planning to make a purchase?',
      type: 'select',
      options: [
        'ASAP',
        'Within 1 week',
        'Within 1 month',
        'Within 3 months',
        'Just browsing'
      ]
    },
    {
      id: 'creditScore',
      title: 'Credit Situation',
      icon: AlertCircle,
      question: 'How would you describe your credit situation?',
      type: 'select',
      options: [
        'Excellent (750+)',
        'Good (700-749)',
        'Fair (650-699)',
        'Poor (600-649)',
        'Very Poor (below 600)',
        'Not sure'
      ]
    }
  ]

  useEffect(() => {
    initializeQualification()
  }, [])

  const initializeQualification = async () => {
    try {
      const response = await aiService.createConversation('lead_qualification', customerId)
      if (response.success && response.data) {
        setConversationId(response.data.id)
        setAiMessage("Hi! I'm here to help qualify your needs. Let me ask you a few questions to find the perfect vehicle for you.")
      }
    } catch (error) {
      console.error('Failed to initialize qualification:', error)
    }
  }

  const handleAnswer = async (answer: string) => {
    const stepId = qualificationSteps[currentStep].id
    setAnswers(prev => ({ ...prev, [stepId]: answer }))

    // Simulate AI response
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (currentStep < qualificationSteps.length - 1) {
      const nextStep = qualificationSteps[currentStep + 1]
      setAiMessage(`Great! ${nextStep.question}`)
      setCurrentStep(currentStep + 1)
    } else {
      // Complete qualification
      await completeQualification()
    }
    setIsProcessing(false)
  }

  const completeQualification = async () => {
    if (!conversationId) return

    setIsProcessing(true)
    try {
      const request: LeadQualificationRequest = {
        conversationId,
        customerId: customerId || 'anonymous',
        answers: {
          budget: answers.budget,
          vehicleType: answers.vehicleType,
          financingNeeds: answers.financingNeeds,
          timeframe: answers.timeframe,
          creditScore: answers.creditScore,
          tradeIn: answers.tradeIn,
          contactPreference: answers.contactPreference,
          appointmentInterest: answers.appointmentInterest
        }
      }

      const response = await aiService.qualifyLead(request)
      if (response.success && response.data) {
        setQualification(response.data.qualification)
        setAiMessage(response.data.recommendation)
        setShowResults(true)
        onQualificationComplete?.(response.data.qualification)
      }
    } catch (error) {
      console.error('Failed to complete qualification:', error)
      setAiMessage("I'm sorry, I encountered an error while processing your qualification. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetQualification = () => {
    setCurrentStep(0)
    setAnswers({
      budget: '',
      vehicleType: '',
      financingNeeds: '',
      timeframe: '',
      creditScore: '',
      tradeIn: '',
      contactPreference: '',
      appointmentInterest: ''
    })
    setQualification(null)
    setShowResults(false)
    initializeQualification()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Highly Qualified'
    if (score >= 60) return 'Qualified'
    return 'Needs Review'
  }

  const currentStepData = qualificationSteps[currentStep]

  if (showResults && qualification) {
    return (
      <Card className={clsx("p-6", className)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Qualification Complete!</h3>
          <div className="mb-6">
            <div className={clsx("text-3xl font-bold mb-2", getScoreColor(qualification.qualificationScore))}>
              {qualification.qualificationScore}/100
            </div>
            <div className={clsx("text-sm font-medium", getScoreColor(qualification.qualificationScore))}>
              {getScoreLabel(qualification.qualificationScore)}
            </div>
          </div>
          
          <div className="text-left space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Your Profile:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-medium">{answers.budget}</span>
                </div>
                <div>
                  <span className="text-gray-600">Vehicle Type:</span>
                  <span className="ml-2 font-medium">{answers.vehicleType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Financing:</span>
                  <span className="ml-2 font-medium">{answers.financingNeeds}</span>
                </div>
                <div>
                  <span className="text-gray-600">Timeline:</span>
                  <span className="ml-2 font-medium">{answers.timeframe}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Next Steps:</h4>
              <ul className="text-sm space-y-1">
                {aiMessage && (
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span>{aiMessage}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">
              Schedule Appointment
            </Button>
            <Button variant="secondary" onClick={resetQualification}>
              Start Over
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={clsx("p-6", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Lead Qualification</h3>
          <p className="text-sm text-gray-600">Answer a few questions to get personalized recommendations</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {qualificationSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / qualificationSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / qualificationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Message */}
        {aiMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-800">{aiMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Step */}
        {!showResults && currentStepData && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <currentStepData.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{currentStepData.title}</h4>
                <p className="text-sm text-gray-600">{currentStepData.question}</p>
              </div>
            </div>

            <div className="space-y-2">
              {currentStepData.options.map((option) => (
                <Button
                  key={option}
                  variant="secondary"
                  onClick={() => handleAnswer(option)}
                  disabled={isProcessing}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
            <span className="text-gray-600">Processing your answer...</span>
          </div>
        )}
      </div>
    </Card>
  )
}
