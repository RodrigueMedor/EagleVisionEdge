import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User, Sparkles, Clock, Check } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { AIMessage, AIConversation, AIQuickAction } from '@/types/ai'
import { mockQuickActions } from '@/data/mockAIConversations'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

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
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null)
  const [quickActions, setQuickActions] = useState<AIQuickAction[]>(mockQuickActions)
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentConversation) return

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      conversationId: currentConversation.id
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await aiService.sendChatMessage({
        content: inputValue.trim(),
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
        
        if (response.data.nextActions) {
          setQuickActions(response.data.nextActions)
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Add error message
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
      metadata: {
        actionType: action.action
      }
    }

    setMessages(prev => [...prev, actionMessage])
    setIsTyping(true)

    try {
      // Simulate AI response based on action
      let responseText = ""
      switch (action.action) {
        case 'show_vehicles':
          responseText = "I'll show you our available vehicles. Let me pull up our current inventory for you."
          break
        case 'financing_options':
          responseText = "I can help you explore financing options. Do you have a specific budget in mind?"
          break
        case 'rental_info':
          responseText = "I'd be happy to help with rental information. Are you looking for a specific type of vehicle?"
          break
        case 'schedule_appointment':
          responseText = "Great! I can help you schedule an appointment. What type of appointment would you like to schedule?"
          break
        case 'apply_financing':
          responseText = "I'll guide you through the financing application process. Let me get that started for you."
          break
        case 'talk_to_sales':
          responseText = "I'll connect you with a sales representative. They'll be with you shortly."
          break
        default:
          responseText = "I understand you're interested in " + action.label.toLowerCase() + ". Let me help you with that."
      }

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const aiMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        conversationId: currentConversation.id,
        metadata: {
          actionType: action.action
        }
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to handle quick action:', error)
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
