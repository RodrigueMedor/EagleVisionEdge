import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckSquare,
  X,
  Calendar,
  DollarSign,
  Car,
  Phone,
  Mail,
  MessageSquare,
  User,
  Zap,
  Target,
  BarChart3,
  Brain,
  Lightbulb
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { AIRecommendation, Customer } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const AIRecommendationsPage: React.FC = () => {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterAcknowledged, setFilterAcknowledged] = useState<string>('all')
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadRecommendations()
  }, [searchQuery, filterType, filterPriority, filterAcknowledged, currentPage])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      const [recommendationsResponse, customersResponse] = await Promise.all([
        crmService.getAIRecommendations(),
        crmService.getCustomers()
      ])

      if (recommendationsResponse.success) {
        let filteredRecommendations = recommendationsResponse.data

        // Apply filters
        if (filterType !== 'all') {
          filteredRecommendations = filteredRecommendations.filter(rec => rec.type === filterType)
        }

        if (filterPriority !== 'all') {
          filteredRecommendations = filteredRecommendations.filter(rec => rec.priority === filterPriority)
        }

        if (filterAcknowledged !== 'all') {
          filteredRecommendations = filteredRecommendations.filter(rec => 
            filterAcknowledged === 'acknowledged' ? rec.acknowledged : !rec.acknowledged
          )
        }

        // Apply search
        if (searchQuery) {
          filteredRecommendations = filteredRecommendations.filter(rec =>
            rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        setRecommendations(filteredRecommendations)
        setTotalPages(Math.ceil(filteredRecommendations.length / 20))
      }

      if (customersResponse.success) {
        setCustomers(customersResponse.data)
      }
    } catch (err) {
      setError('Failed to load AI recommendations')
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledgeRecommendation = async (recommendationId: string) => {
    try {
      setRecommendations(recommendations.map(rec =>
        rec.id === recommendationId
          ? { 
              ...rec, 
              acknowledged: true, 
              acknowledgedAt: new Date(),
              acknowledgedBy: 'current_user'
            }
          : rec
      ))
    } catch (err) {
      setError('Failed to acknowledge recommendation')
    }
  }

  const handleDismissRecommendation = async (recommendationId: string) => {
    try {
      setRecommendations(recommendations.filter(rec => rec.id !== recommendationId))
    } catch (err) {
      setError('Failed to dismiss recommendation')
    }
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Unknown Customer'
  }

  const getTypeIcon = (type: AIRecommendation['type']) => {
    const icons: Record<AIRecommendation['type'], React.ReactNode> = {
      'follow_up': <Clock size={16} />,
      'lead_score': <Star size={16} />,
      'vehicle_match': <Car size={16} />,
      'financing_tip': <DollarSign size={16} />,
      'rental_opportunity': <Car size={16} />,
      'engagement': <MessageSquare size={16} />
    }
    return icons[type] || <Lightbulb size={16} />
  }

  const getTypeColor = (type: AIRecommendation['type']) => {
    const colors: Record<AIRecommendation['type'], string> = {
      'follow_up': 'bg-blue-100 text-blue-800',
      'lead_score': 'bg-purple-100 text-purple-800',
      'vehicle_match': 'bg-green-100 text-green-800',
      'financing_tip': 'bg-yellow-100 text-yellow-800',
      'rental_opportunity': 'bg-orange-100 text-orange-800',
      'engagement': 'bg-pink-100 text-pink-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
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

  const paginatedRecommendations = recommendations.slice((currentPage - 1) * 20, currentPage * 20)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 text-purple-600" size={36} />
              AI CRM Recommendations
            </h1>
            <p className="text-gray-600 mt-1">AI-powered insights and actionable recommendations</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard/crm')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to CRM
            </button>
            <button
              onClick={loadRecommendations}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Bot className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {recommendations.filter(r => r.priority === 'high' && !r.acknowledged).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Acknowledged</p>
                <p className="text-2xl font-bold text-green-600">
                  {recommendations.filter(r => r.acknowledged).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckSquare className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-purple-600">
                  {recommendations.length > 0 
                    ? Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)
                    : 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Target className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recommendations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="follow_up">Follow-up</option>
              <option value="lead_score">Lead Score</option>
              <option value="vehicle_match">Vehicle Match</option>
              <option value="financing_tip">Financing Tip</option>
              <option value="rental_opportunity">Rental Opportunity</option>
              <option value="engagement">Engagement</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterAcknowledged}
              onChange={(e) => setFilterAcknowledged(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="unacknowledged">Unacknowledged</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRecommendations.map((recommendation) => (
            <div 
              key={recommendation.id}
              className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                recommendation.priority === 'high' && !recommendation.acknowledged 
                  ? 'border-red-200' 
                  : 'border-transparent'
              }`}
              onClick={() => {
                setSelectedRecommendation(recommendation)
                setShowDetailModal(true)
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {getTypeIcon(recommendation.type)}
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(recommendation.type)}`}>
                      {recommendation.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {recommendation.priority === 'high' && !recommendation.acknowledged && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(recommendation.priority)}`}>
                    {recommendation.priority}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{recommendation.description}</p>

              {/* Customer Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{getCustomerName(recommendation.customerId)}</span>
                </div>
                <div className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                  {recommendation.confidence}% confidence
                </div>
              </div>

              {/* Suggested Action */}
              {recommendation.suggestedAction && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Lightbulb size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Suggested Action:</p>
                      <p className="text-sm text-blue-700">{recommendation.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {formatRelativeTime(recommendation.createdAt)}
                </div>
                <div className="flex items-center space-x-2">
                  {recommendation.actionable && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Actionable
                    </span>
                  )}
                  {recommendation.acknowledged && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      Acknowledged
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {!recommendation.acknowledged && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAcknowledgeRecommendation(recommendation.id)
                      }}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/dashboard/crm/customers/${recommendation.customerId}`)
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View Customer
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDismissRecommendation(recommendation.id)
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginatedRecommendations.length === 0 && (
          <div className="text-center py-12">
            <Bot className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No AI recommendations found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, recommendations.length)} of {recommendations.length} recommendations
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    {getTypeIcon(selectedRecommendation.type)}
                  </div>
                  {selectedRecommendation.title}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recommendation Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getTypeColor(selectedRecommendation.type)}`}>
                        {selectedRecommendation.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Priority:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedRecommendation.priority)}`}>
                        {selectedRecommendation.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Confidence:</span>
                      <span className={`ml-2 font-medium ${getConfidenceColor(selectedRecommendation.confidence)}`}>
                        {selectedRecommendation.confidence}%
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Customer:</span>
                      <span className="ml-2 text-sm">{getCustomerName(selectedRecommendation.customerId)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Created:</span>
                      <span className="ml-2 text-sm">{formatRelativeTime(selectedRecommendation.createdAt)}</span>
                    </div>
                    {selectedRecommendation.dueDate && (
                      <div>
                        <span className="text-sm text-gray-500">Due Date:</span>
                        <span className="ml-2 text-sm">{selectedRecommendation.dueDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Status</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Actionable:</span>
                      <span className="ml-2 text-sm">
                        {selectedRecommendation.actionable ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Acknowledged:</span>
                      <span className="ml-2 text-sm">
                        {selectedRecommendation.acknowledged ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {selectedRecommendation.acknowledgedAt && (
                      <div>
                        <span className="text-sm text-gray-500">Acknowledged At:</span>
                        <span className="ml-2 text-sm">
                          {selectedRecommendation.acknowledgedAt.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedRecommendation.acknowledgedBy && (
                      <div>
                        <span className="text-sm text-gray-500">Acknowledged By:</span>
                        <span className="ml-2 text-sm">{selectedRecommendation.acknowledgedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-600">{selectedRecommendation.description}</p>
              </div>

              {/* Suggested Action */}
              {selectedRecommendation.suggestedAction && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Suggested Action</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="text-blue-600 mt-1" size={20} />
                      <p className="text-blue-900">{selectedRecommendation.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end space-x-3">
                {!selectedRecommendation.acknowledged && (
                  <button
                    onClick={() => {
                      handleAcknowledgeRecommendation(selectedRecommendation.id)
                      setShowDetailModal(false)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Acknowledge Recommendation
                  </button>
                )}
                <button
                  onClick={() => navigate(`/dashboard/crm/customers/${selectedRecommendation.customerId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Customer Profile
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIRecommendationsPage
