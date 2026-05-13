import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  User, 
  Bot, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Car, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react'
import { TimelineActivity, Customer } from '@/types/crm'
import { crmService } from '@/services/crmService'

interface CustomerTimelineProps {
  customerId: string
  showFilters?: boolean
  maxHeight?: string
}

const CustomerTimeline: React.FC<CustomerTimelineProps> = ({ 
  customerId, 
  showFilters = true,
  maxHeight = '600px' 
}) => {
  const [activities, setActivities] = useState<TimelineActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  useEffect(() => {
    loadTimelineActivities()
  }, [customerId, filter, searchQuery])

  const loadTimelineActivities = async () => {
    try {
      setLoading(true)
      setError(null)

      // Generate mock timeline activities for this customer
      const mockActivities: TimelineActivity[] = [
        {
          id: 'activity_1',
          type: 'customer_action',
          title: 'Customer submitted financing inquiry',
          description: 'Customer submitted an online financing application for 2023 Toyota Camry',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          customerId,
          metadata: {
            vehicle: '2023 Toyota Camry',
            applicationId: 'fin_12345',
            amount: 25000
          },
          icon: 'file-text',
          color: 'blue'
        },
        {
          id: 'activity_2',
          type: 'ai_action',
          title: 'AI assistant responded to inquiry',
          description: 'AI assistant provided initial financing options and requested additional documentation',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
          customerId,
          metadata: {
            responseId: 'ai_resp_67890',
            confidence: 0.95
          },
          icon: 'bot',
          color: 'purple'
        },
        {
          id: 'activity_3',
          type: 'salesperson_action',
          title: 'Salesperson contacted customer',
          description: 'John Smith called customer to discuss financing options and schedule test drive',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          userId: 'sales_1',
          customerId,
          metadata: {
            callDuration: 12,
            outcome: 'successful'
          },
          icon: 'phone',
          color: 'green'
        },
        {
          id: 'activity_4',
          type: 'customer_action',
          title: 'Test drive scheduled',
          description: 'Customer scheduled test drive for tomorrow at 2:00 PM',
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          customerId,
          metadata: {
            appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            vehicle: '2023 Toyota Camry'
          },
          icon: 'calendar',
          color: 'orange'
        },
        {
          id: 'activity_5',
          type: 'system_action',
          title: 'Financing application updated',
          description: 'Credit check completed successfully. Customer approved for financing',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          customerId,
          metadata: {
            creditScore: 720,
            approvedAmount: 28000,
            interestRate: 4.5
          },
          icon: 'check-circle',
          color: 'green'
        },
        {
          id: 'activity_6',
          type: 'ai_action',
          title: 'AI recommendation generated',
          description: 'AI suggests following up with customer regarding trade-in options',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          customerId,
          metadata: {
            recommendationType: 'trade_in',
            priority: 'high',
            confidence: 0.87
          },
          icon: 'alert-circle',
          color: 'yellow'
        },
        {
          id: 'activity_7',
          type: 'salesperson_action',
          title: 'Follow-up task created',
          description: 'Created follow-up task to call customer about trade-in evaluation',
          timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          userId: 'sales_1',
          customerId,
          metadata: {
            taskId: 'task_123',
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
            priority: 'high'
          },
          icon: 'clock',
          color: 'purple'
        }
      ]

      // Apply filters
      let filteredActivities = mockActivities

      if (filter !== 'all') {
        filteredActivities = filteredActivities.filter(activity => activity.type === filter)
      }

      if (searchQuery) {
        filteredActivities = filteredActivities.filter(activity =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setActivities(filteredActivities)
    } catch (err) {
      setError('Failed to load timeline activities')
    } finally {
      setLoading(false)
    }
  }

  const toggleActivityExpansion = (activityId: string) => {
    const newExpanded = new Set(expandedActivities)
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId)
    } else {
      newExpanded.add(activityId)
    }
    setExpandedActivities(newExpanded)
  }

  const getActivityIcon = (activity: TimelineActivity) => {
    const iconMap: Record<string, React.ReactNode> = {
      'user': <User size={16} />,
      'bot': <Bot size={16} />,
      'phone': <Phone size={16} />,
      'calendar': <Calendar size={16} />,
      'car': <Car size={16} />,
      'dollar-sign': <DollarSign size={16} />,
      'file-text': <FileText size={16} />,
      'check-circle': <CheckCircle size={16} />,
      'alert-circle': <AlertCircle size={16} />,
      'clock': <Clock size={16} />,
      'message-square': <MessageSquare size={16} />
    }

    return iconMap[activity.icon || 'clock'] || <Clock size={16} />
  }

  const getActivityColor = (activity: TimelineActivity) => {
    const colorMap: Record<string, string> = {
      'customer_action': 'bg-blue-500',
      'salesperson_action': 'bg-green-500',
      'ai_action': 'bg-purple-500',
      'system_action': 'bg-gray-500'
    }

    return colorMap[activity.type] || 'bg-gray-500'
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      return `${diffInDays} days ago`
    }
  }

  const getFilterOptions = () => [
    { value: 'all', label: 'All Activities', icon: <Clock size={16} /> },
    { value: 'customer_action', label: 'Customer Actions', icon: <User size={16} /> },
    { value: 'salesperson_action', label: 'Salesperson Actions', icon: <Phone size={16} /> },
    { value: 'ai_action', label: 'AI Actions', icon: <Bot size={16} /> },
    { value: 'system_action', label: 'System Actions', icon: <AlertCircle size={16} /> }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadTimelineActivities}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="mr-2" size={20} />
            Customer Timeline
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadTimelineActivities}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Export"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        {showFilters && (
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search timeline activities..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              {getFilterOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                    filter === option.value
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div 
        className="p-6 overflow-y-auto"
        style={{ maxHeight }}
      >
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No timeline activities found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${getActivityColor(activity)} flex items-center justify-center text-white`}>
                    {getActivityIcon(activity)}
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activity.type === 'customer_action' ? 'bg-blue-100 text-blue-800' :
                            activity.type === 'salesperson_action' ? 'bg-green-100 text-green-800' :
                            activity.type === 'ai_action' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                        
                        {/* Metadata */}
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="space-y-1">
                            {Object.entries(activity.metadata).map(([key, value]) => (
                              <div key={key} className="text-xs text-gray-500">
                                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                                <span>
                                  {typeof value === 'object' && value instanceof Date 
                                    ? value.toLocaleDateString()
                                    : String(value)
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                        <button
                          onClick={() => toggleActivityExpansion(activity.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {expandedActivities.has(activity.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedActivities.has(activity.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Activity ID:</span>
                            <span className="ml-2 text-gray-900">{activity.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Timestamp:</span>
                            <span className="ml-2 text-gray-900">{activity.timestamp.toLocaleString()}</span>
                          </div>
                          {activity.userId && (
                            <div>
                              <span className="text-gray-500">User:</span>
                              <span className="ml-2 text-gray-900">{activity.userId}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-2 text-gray-900">{activity.type}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            <Eye size={14} className="inline mr-1" />
                            View Details
                          </button>
                          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                            Add Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {activities.length} activities
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Load more activities
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerTimeline
