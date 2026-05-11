import { useState, useEffect } from 'react'
import { MessageCircle, User, Bot, Search, Filter, Calendar, Clock, ChevronDown, ChevronRight, Trash2, Download } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { AIConversation, AIMessage } from '@/types/ai'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface AIConversationHistoryProps {
  customerId?: string
  className?: string
}

export default function AIConversationHistory({ customerId, className }: AIConversationHistoryProps) {
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<AIConversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState('recent')

  const conversationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'chat', label: 'General Chat' },
    { value: 'lead_qualification', label: 'Lead Qualification' },
    { value: 'financing', label: 'Financing' },
    { value: 'rental', label: 'Rental' },
    { value: 'appointment', label: 'Appointment' }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'messages', label: 'Most Messages' },
    { value: 'duration', label: 'Longest Duration' }
  ]

  useEffect(() => {
    loadConversations()
  }, [customerId])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await aiService.getConversations(customerId)
      if (response.success && response.data) {
        setConversations(response.data)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleConversationExpansion = (conversationId: string) => {
    const newExpanded = new Set(expandedConversations)
    if (newExpanded.has(conversationId)) {
      newExpanded.delete(conversationId)
    } else {
      newExpanded.add(conversationId)
    }
    setExpandedConversations(newExpanded)
  }

  const loadConversationDetails = async (conversationId: string) => {
    try {
      const response = await aiService.getConversationHistory(conversationId)
      if (response.success && response.data) {
        setSelectedConversation(response.data)
      }
    } catch (error) {
      console.error('Failed to load conversation details:', error)
    }
  }

  const filteredAndSortedConversations = conversations
    .filter(conv => {
      const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || conv.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'messages':
          return (b.messages?.length || 0) - (a.messages?.length || 0)
        case 'duration':
          const aDuration = new Date(a.updatedAt).getTime() - new Date(a.startedAt).getTime()
          const bDuration = new Date(b.updatedAt).getTime() - new Date(b.startedAt).getTime()
          return bDuration - aDuration
        default:
          return 0
      }
    })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    }).format(date)
  }

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'lead_qualification':
        return '🎯'
      case 'financing':
        return '💰'
      case 'rental':
        return '🔑'
      case 'appointment':
        return '📅'
      default:
        return '💬'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'completed':
        return 'text-blue-600 bg-blue-100'
      case 'archived':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const exportConversation = (conversation: AIConversation) => {
    const content = `Conversation: ${conversation.title}\n` +
                    `Type: ${conversation.type}\n` +
                    `Started: ${conversation.startedAt.toLocaleString()}\n` +
                    `Status: ${conversation.status}\n\n` +
                    `Messages:\n${conversation.messages.map(msg => 
                      `${msg.role.toUpperCase()}: ${msg.content}\n[${msg.timestamp.toLocaleString()}]\n`
                    ).join('\n')}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${conversation.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card className={clsx("p-6", className)}>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation history...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={clsx("p-6", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Conversation History</h3>
            <p className="text-sm text-gray-600">Review all AI conversations and interactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="secondary" size="sm" onClick={loadConversations}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-48"
          >
            {conversationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-48"
          >
            {sortOptions.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Conversation List */}
        <div className="space-y-3">
          {filteredAndSortedConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h4>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No conversations available yet'
                }
              </p>
            </div>
          ) : (
            filteredAndSortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
              >
                {/* Conversation Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleConversationExpansion(conversation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getConversationIcon(conversation.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{conversation.title}</h4>
                          <span className={clsx(
                            "px-2 py-1 rounded text-xs font-medium",
                            getStatusColor(conversation.status)
                          )}>
                            {conversation.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="capitalize">{conversation.type.replace('_', ' ')}</span>
                          <span>{conversation.messages?.length || 0} messages</span>
                          <span>{formatTime(conversation.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          exportConversation(conversation)
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {expandedConversations.has(conversation.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Messages */}
                {expandedConversations.has(conversation.id) && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {conversation.messages?.map((message) => (
                        <div
                          key={message.id}
                          className={clsx(
                            "flex gap-3",
                            message.role === 'user' ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div
                            className={clsx(
                              "max-w-[80%] rounded-lg px-4 py-2",
                              message.role === 'user'
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-200"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={clsx(
                              "text-xs mt-1",
                              message.role === 'user' ? "text-blue-100" : "text-gray-500"
                            )}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.role === 'user' && (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Conversation Actions */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Started: {conversation.startedAt.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Duration: {Math.round(
                                (new Date(conversation.updatedAt).getTime() - 
                                 new Date(conversation.startedAt).getTime()) / 60000
                              )} min
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => loadConversationDetails(conversation.id)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredAndSortedConversations.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{filteredAndSortedConversations.length}</p>
                <p className="text-sm text-gray-600">Total Conversations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAndSortedConversations.filter(c => c.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredAndSortedConversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Messages</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    filteredAndSortedConversations.reduce((sum, c) => {
                      const duration = new Date(c.updatedAt).getTime() - new Date(c.startedAt).getTime()
                      return sum + duration
                    }, 0) / filteredAndSortedConversations.length / 60000
                  )} min
                </p>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
