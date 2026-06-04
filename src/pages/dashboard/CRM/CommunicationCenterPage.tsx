import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Phone,
  Mail,
  Bot,
  Send,
  Search,
  Plus,
  Archive,
  Star,
  MoreVertical,
  User,
  Paperclip,
  Smile,
  PhoneCall,
  Video,
  Calendar
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { CommunicationThread, CommunicationMessage, Customer, CommunicationType } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const CommunicationCenterPage: React.FC = () => {
  const navigate = useNavigate()
  const [threads, setThreads] = useState<CommunicationThread[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedThread, setSelectedThread] = useState<CommunicationThread | null>(null)
  const [messages, setMessages] = useState<CommunicationMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [newMessage, setNewMessage] = useState('')
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [messageType, setMessageType] = useState<CommunicationType>('email')

  useEffect(() => {
    loadCommunicationData()
  }, [searchQuery, filterType, filterStatus])

  useEffect(() => {
    if (selectedThread) {
      loadThreadMessages(selectedThread.id)
    }
  }, [selectedThread])

  const loadCommunicationData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Generate mock communication threads
      const mockThreads: CommunicationThread[] = [
        {
          id: 'thread_1',
          customerId: 'customer_1',
          participants: ['sales_1', 'customer_1'],
          messages: [],
          subject: 'Financing Application for 2023 Toyota Camry',
          status: 'active',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000),
          lastMessageAt: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 'thread_2',
          customerId: 'customer_2',
          participants: ['sales_2', 'customer_2'],
          messages: [],
          subject: 'Test Drive Scheduled',
          status: 'active',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'thread_3',
          customerId: 'customer_3',
          participants: ['ai_assistant', 'customer_3'],
          messages: [],
          subject: 'Vehicle Information Request',
          status: 'active',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]

      const customersResponse = await crmService.getCustomers()
      
      if (customersResponse.success) {
        setCustomers(customersResponse.data)
      }

      // Apply filters
      let filteredThreads = mockThreads
      if (searchQuery) {
        filteredThreads = filteredThreads.filter(thread =>
          thread.subject?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setThreads(filteredThreads)
    } catch (err) {
      setError('Failed to load communication data')
    } finally {
      setLoading(false)
    }
  }

  const loadThreadMessages = async (threadId: string) => {
    try {
      // Generate mock messages for the thread
      const mockMessages: CommunicationMessage[] = [
        {
          id: 'msg_1',
          threadId,
          senderId: 'customer_1',
          content: 'Hi, I\'m interested in financing a 2023 Toyota Camry. Can you provide me with information about the available options?',
          type: 'email',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
          readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          aiGenerated: false
        },
        {
          id: 'msg_2',
          threadId,
          senderId: 'ai_assistant',
          content: 'Hello! Thank you for your interest in the 2023 Toyota Camry. I\'d be happy to help you with financing options. We have several great financing packages available with competitive rates. Could you tell me more about your budget range and preferred loan term?',
          type: 'ai_chat',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          isRead: true,
          readAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          aiGenerated: true
        },
        {
          id: 'msg_3',
          threadId,
          senderId: 'sales_1',
          content: 'Hi there! I saw your inquiry about the Camry financing. I\'m John from the financing department. I can help you explore the best options based on your needs. Do you have a preferred down payment amount?',
          type: 'call',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isRead: true,
          readAt: new Date(Date.now() - 30 * 60 * 1000),
          aiGenerated: false
        },
        {
          id: 'msg_4',
          threadId,
          senderId: 'customer_1',
          content: 'Thanks John! I\'m looking at around $5,000 down payment and a 60-month term. My credit score is around 720. What kind of rates can I expect?',
          type: 'email',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: true,
          readAt: new Date(Date.now() - 15 * 60 * 1000),
          aiGenerated: false
        }
      ]

      setMessages(mockMessages)
    } catch (err) {
      setError('Failed to load thread messages')
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return

    const newMsg: CommunicationMessage = {
      id: `msg_${Date.now()}`,
      threadId: selectedThread.id,
      senderId: 'current_user',
      content: newMessage,
      type: messageType,
      timestamp: new Date(),
      isRead: true,
      aiGenerated: false
    }

    setMessages([...messages, newMsg])
    setNewMessage('')

    // Update thread's last message time
    setThreads(threads.map(thread =>
      thread.id === selectedThread.id
        ? { ...thread, lastMessageAt: new Date(), updatedAt: new Date() }
        : thread
    ))
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Unknown Customer'
  }

  const getSenderName = (senderId: string) => {
    if (senderId === 'current_user') return 'You'
    if (senderId === 'ai_assistant') return 'AI Assistant'
    
    const customer = customers.find(c => c.id === senderId)
    if (customer) return customer.name
    
    // Salesperson names
    const salespersonNames: Record<string, string> = {
      'sales_1': 'John Smith',
      'sales_2': 'Jane Doe',
      'sales_3': 'Mike Johnson'
    }
    
    return salespersonNames[senderId] || senderId
  }

  const getMessageIcon = (type: CommunicationType) => {
    const icons: Record<CommunicationType, React.ReactNode> = {
      'call': <Phone size={16} />,
      'email': <Mail size={16} />,
      'sms': <MessageSquare size={16} />,
      'note': <MessageSquare size={16} />,
      'ai_chat': <Bot size={16} />,
      'appointment': <Calendar size={16} />,
      'financing_update': <MessageSquare size={16} />,
      'rental_update': <MessageSquare size={16} />
    }
    return icons[type] || <MessageSquare size={16} />
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${diffInDays}d ago`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard/crm')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to CRM
            </button>
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="sms">SMS</option>
            <option value="ai_chat">AI Chat</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
            <div className="space-y-2">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedThread?.id === thread.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {getCustomerName(thread.customerId)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {thread.participants.length} participants
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(thread.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium mb-1">
                    {thread.subject}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      thread.status === 'active' ? 'bg-green-100 text-green-800' :
                      thread.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {thread.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Star size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Archive size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedThread.subject}
                    </h2>
                    <p className="text-sm text-gray-500">
                      with {getCustomerName(selectedThread.customerId)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <PhoneCall size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Video size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Calendar size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.senderId === 'current_user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.senderId !== 'current_user' && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          {message.aiGenerated ? (
                            <Bot size={16} />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                      )}
                      <div className={`max-w-md ${
                        message.senderId === 'current_user' ? 'order-first' : ''
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {getSenderName(message.senderId)}
                          </span>
                          {message.aiGenerated && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              AI
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(message.timestamp)}
                          </span>
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.senderId === 'current_user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="text-gray-500">
                              {getMessageIcon(message.type)}
                            </div>
                            <span className="text-xs capitalize">
                              {message.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Paperclip size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {message.attachments.length} attachment(s)
                            </span>
                          </div>
                        )}
                      </div>
                      {message.senderId === 'current_user' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value as CommunicationType)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="note">Note</option>
                      </select>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Paperclip size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Smile size={18} />
                      </button>
                    </div>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send size={20} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">New Conversation</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Conversation subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Message
                  </label>
                  <textarea
                    placeholder="Start the conversation..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle creating new thread
                    setShowNewThreadModal(false)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunicationCenterPage
