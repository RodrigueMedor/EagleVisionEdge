import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User, Sparkles, Clock, Check } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { inventoryService } from '@/services/inventoryService'
import { rentalsService } from '@/services/rentalsService'
import { leadsService } from '@/services/leadsService'
import { useNotification } from '@/hooks'
import { AIMessage, AIConversation, AIQuickAction } from '@/types/ai'
import { mockQuickActions } from '@/data/mockAIConversations'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

interface AIChatWidgetProps {
  className?: string
  initialMessage?: string
  conversationType?: string
}

export default function AIChatWidget({ 
  className, 
  initialMessage = "Hello! I'm your AI assistant. How can I help you today?",
  conversationType = 'general'
}: AIChatWidgetProps) {
  const { success: showSuccess, error: showError } = useNotification()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null)
  const [quickActions, setQuickActions] = useState<AIQuickAction[]>(mockQuickActions)
  const [bookingStep, setBookingStep] = useState(-1)
  const [bookingData, setBookingData] = useState<{
    vehicleInterest: string
    customerName: string
    email: string
    phone: string
    preferredDate: string
  }>({ vehicleInterest: '', customerName: '', email: '', phone: '', preferredDate: '' })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && !currentConversation) {
      initializeConversation()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeConversation = async () => {
    try {
      const response = await aiService.createConversation(conversationType)
      if (response.success && response.data) {
        setCurrentConversation(response.data)
        
        // Add initial AI message
        const initialAIMessage: AIMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date(),
          conversationId: response.data.id
        }
        setMessages([initialAIMessage])
      }
    } catch (error) {
      console.error('Failed to initialize conversation:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const advanceBooking = (userInput: string) => {
    const nextStep = bookingStep + 1
    setBookingStep(nextStep)

    const updatedData = { ...bookingData }

    switch (nextStep) {
      case 1:
        updatedData.vehicleInterest = userInput
        setBookingData(updatedData)
        return "Great choice! Now, **what's your full name?**"
      case 2:
        updatedData.customerName = userInput
        setBookingData(updatedData)
        return "Thanks! **What's your email address?** so we can send you the details."
      case 3:
        updatedData.email = userInput
        setBookingData(updatedData)
        return "Almost done! **What's your phone number?** so we can reach you."
      case 4:
        updatedData.phone = userInput
        setBookingData(updatedData)
        return "Perfect! **When would you like to come in?** (e.g., 'This Saturday at 2pm' or 'Next Tuesday morning')"
      case 5:
        updatedData.preferredDate = userInput
        setBookingData(updatedData)
        return null // will trigger final submission
      default:
        return null
    }
  }

  const submitBooking = async () => {
    try {
      const lead = await leadsService.addLead({
        firstName: bookingData.customerName.split(' ')[0] || bookingData.customerName,
        lastName: bookingData.customerName.split(' ').slice(1).join(' ') || 'N/A',
        email: bookingData.email,
        phone: bookingData.phone,
        status: 'new',
        score: 'warm',
        source: 'AI Chatbot',
        interestedVehicles: [],
        vehicleInterest: bookingData.vehicleInterest,
        message: `Booked via AI Chatbot. Preferred date: ${bookingData.preferredDate}`,
        notes: [{
          id: `note-${Date.now()}`,
          content: `Lead created via AI Chatbot booking flow. Interest: ${bookingData.vehicleInterest}. Preferred date: ${bookingData.preferredDate}`,
          createdAt: new Date(),
          createdBy: 'AI Assistant'
        }],
        communicationHistory: [],
        lastContact: new Date(),
      })

      setBookingStep(-1)
      setBookingData({ vehicleInterest: '', customerName: '', email: '', phone: '', preferredDate: '' })
      showSuccess(`Booking Submitted! We've received your interest in ${bookingData.vehicleInterest}. A sales specialist will contact you at ${bookingData.phone} soon!`)

      return `✅ **Booking confirmed!** Thank you, ${bookingData.customerName}!\n\nHere's a summary:\n• **Vehicle:** ${bookingData.vehicleInterest}\n• **Visit:** ${bookingData.preferredDate}\n• **Contact:** ${bookingData.email} / ${bookingData.phone}\n\nA sales specialist will reach out to you shortly. You can also call us at (555) 123-4567 to schedule sooner!`
    } catch (error) {
      setBookingStep(-1)
      showError('Booking Failed. Please try again or call us at (555) 123-4567.')
      return "I'm sorry, I couldn't complete your booking. Please try again or call us at (555) 123-4567."
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentConversation) return

    const userText = inputValue.trim()

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date(),
      conversationId: currentConversation.id
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // If we're in booking flow, advance the step
      if (bookingStep >= 0) {
        const reply = advanceBooking(userText)
        if (reply !== null) {
          await new Promise(resolve => setTimeout(resolve, 600))
          const aiMessage: AIMessage = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: reply,
            timestamp: new Date(),
            conversationId: currentConversation.id,
          }
          setMessages(prev => [...prev, aiMessage])
        } else {
          // Final step — submit
          await new Promise(resolve => setTimeout(resolve, 600))
          const finalReply = await submitBooking()
          const aiMessage: AIMessage = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: finalReply,
            timestamp: new Date(),
            conversationId: currentConversation.id,
          }
          setMessages(prev => [...prev, aiMessage])
          setQuickActions(mockQuickActions.slice(0, 2))
        }
        setIsTyping(false)
        return
      }

      // Normal chat
      const response = await aiService.sendChatMessage({
        content: userText,
        conversationId: currentConversation.id
      })

      if (response.success && response.data) {
        const aiMessage: AIMessage = {
          id: response.data.message.id,
          role: 'assistant',
          content: response.data.message.content,
          timestamp: response.data.message.timestamp,
          conversationId: response.data.message.conversationId
        }
        setMessages(prev => [...prev, aiMessage])
        
        // Check if response starts a booking flow
        const content = response.data.message.content.toLowerCase()
        if (
          content.includes('which vehicle are you interested in') ||
          content.includes("let me guide you through a few quick questions")
        ) {
          setBookingStep(0)
        }

        if (response.data.nextActions) {
          setQuickActions(response.data.nextActions)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        conversationId: currentConversation.id
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = async (action: AIQuickAction) => {
    if (!currentConversation) return

    const actionMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: action.label,
      timestamp: new Date(),
      conversationId: currentConversation.id,
      metadata: { actionType: action.action }
    }

    setMessages(prev => [...prev, actionMessage])
    setIsTyping(true)

    try {
      let responseText = ""
      switch (action.action) {
        case 'show_vehicles': {
          const vehicles = await inventoryService.getVehicles()
          const available = vehicles.filter(v => v.status === 'available').slice(0, 5)
          if (available.length === 0) {
            responseText = "We currently have no available vehicles. Check back soon!"
          } else {
            const lines = available.map(v =>
              `• ${v.year} ${v.make} ${v.model} — ${formatCurrency(v.price)} | ${v.mileage.toLocaleString()} mi | ${v.fuelType}`
            )
            responseText = `Here are our available vehicles:\n\n${lines.join('\n')}\n\nWant details on any of these?`
          }
          break
        }
        case 'financing_options':
          responseText = "We offer financing for all credit levels:\n\n• Excellent Credit: From 3.9% APR\n• Good Credit: From 5.9% APR\n• Fair Credit: From 7.9% APR\n\nWe work with multiple lenders to find the best rate for you. Would you like to apply?"
          break
        case 'rental_info': {
          const rentals = await rentalsService.getRentals()
          if (rentals.length === 0) {
            responseText = "We offer vehicle rentals! Call (555) 123-4567 for current rates and availability."
          } else {
            const activeCount = rentals.filter(r => r.status === 'active' || r.status === 'pending').length
            responseText = `We have ${rentals.length} rental vehicle${rentals.length > 1 ? 's' : ''} in our fleet (${activeCount} currently active).\n\nCall (555) 123-4567 or visit our showroom for rates and availability!`
          }
          break
        }
        case 'schedule_appointment':
          responseText = "Great! We're open Mon-Fri 9AM-7PM, Sat 9AM-5PM. Give us a call at (555) 123-4567 to book, or visit us at 123 Main Street, Miami, FL 33101."
          break
        case 'apply_financing':
          responseText = "I can help you get pre-approved! Visit our financing page or call (555) 123-4567 to start your application. Make sure to have your income info and ID ready."
          break
        case 'talk_to_sales':
          responseText = "A sales specialist will be with you shortly. In the meantime, you can reach us directly at (555) 123-4567 or visit our showroom at 123 Main Street, Miami."
          break
        default:
          responseText = "Let me help you with that. What would you like to know?"
      }

      const aiMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        conversationId: currentConversation.id,
        metadata: { actionType: action.action }
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to handle quick action:', error)
      const errorMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again or call us at (555) 123-4567.",
        timestamp: new Date(),
        conversationId: currentConversation.id,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const messageTime = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return messageTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!isOpen) {
    return (
      <div className={clsx("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          variant="primary"
          size="lg"
          className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-300 group border border-white/20 backdrop-blur-sm"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
          <span className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              AI Assistant
            </div>
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div className={clsx("fixed bottom-6 right-6 z-50", className)}>
      <div className={clsx(
        "bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 transition-all duration-300 ease-out",
        isMinimized ? "w-80 h-16" : "w-96 h-[650px] max-h-[85vh]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-5 h-5" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2">
                AI Assistant
                <span className="px-2 py-0.5 bg-green-400/30 text-green-100 text-xs rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </h3>
              <p className="text-xs opacity-90">Powered by Advanced AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[450px] bg-gradient-to-b from-gray-50/50 to-white/50 chat-scrollbar">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={clsx(
                    "flex gap-3 animate-fade-in",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === 'assistant' && (
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                  <div
                    className={clsx(
                      "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border transition-all duration-200 hover:shadow-md",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-200/50 ml-auto"
                        : "bg-white text-gray-800 border-gray-200/50 shadow-sm"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className={clsx(
                      "flex items-center gap-2 mt-2 text-xs",
                      message.role === 'user' ? "text-indigo-100" : "text-gray-500"
                    )}>
                      <Clock className="w-3 h-3" />
                      {formatTime(message.timestamp)}
                      {message.role === 'user' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start animate-fade-in">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200/50">
                    <div className="flex gap-1 items-center">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                <p className="text-xs text-gray-600 mb-2 font-medium">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.slice(0, 3).map((action) => (
                    <Button
                      key={action.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border border-indigo-200/50 rounded-lg transition-all duration-200 hover:shadow-sm"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-white border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent shadow-sm transition-all duration-200 text-sm"
                    disabled={isTyping}
                  />
                  {inputValue && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-3 rounded-xl border border-white/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
