import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  Bot,
  Car,
  CreditCard,
  FileText,
  MessageSquare,
  Eye,
  ArrowRight,
  Star,
  Target
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { CRMDashboardData, FollowUp, AIRecommendation, Lead } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const CRMDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<CRMDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await crmService.getCRMDashboardData()
      
      if (response.success) {
        setDashboardData(response.data)
      } else {
        setError(response.message || 'Failed to load dashboard data')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Failed to load dashboard data'}</div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const { metrics, recentActivities, upcomingFollowUps, aiRecommendations, urgentLeads, recentCommunications } = dashboardData

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New Lead': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Appointment Scheduled': 'bg-purple-100 text-purple-800',
      'Financing Pending': 'bg-orange-100 text-orange-800',
      'Negotiation': 'bg-pink-100 text-pink-800',
      'Sold': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to your dealership CRM command center</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Main Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/analytics')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Full Analytics
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalLeads}</p>
                <p className="text-sm text-green-600 mt-1">
                  +{metrics.newLeadsThisMonth} this month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">{metrics.conversionRate}%</p>
                <p className="text-sm text-gray-500 mt-1">Above industry average</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue This Month</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${metrics.revenueThisMonth.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ${metrics.projectedRevenue.toLocaleString()} projected
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.averageResponseTime}m</p>
                <p className="text-sm text-green-600 mt-1">-15% from last month</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/dashboard/crm/leads')}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-left transition-colors"
            >
              <Users className="text-blue-600 mb-2" size={24} />
              <div className="text-sm font-medium text-blue-900">Manage Leads</div>
              <div className="text-xs text-blue-700">View and track all leads</div>
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/pipeline')}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-left transition-colors"
            >
              <BarChart3 className="text-green-600 mb-2" size={24} />
              <div className="text-sm font-medium text-green-900">Sales Pipeline</div>
              <div className="text-xs text-green-700">Track deal progress</div>
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/follow-ups')}
              className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 text-left transition-colors"
            >
              <Calendar className="text-yellow-600 mb-2" size={24} />
              <div className="text-sm font-medium text-yellow-900">Follow-ups</div>
              <div className="text-xs text-yellow-700">Schedule and track</div>
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/ai-recommendations')}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-left transition-colors"
            >
              <Bot className="text-purple-600 mb-2" size={24} />
              <div className="text-sm font-medium text-purple-900">AI Insights</div>
              <div className="text-xs text-purple-700">Get recommendations</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Urgent Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Leads */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertCircle className="mr-2 text-red-600" size={20} />
                  Urgent Leads
                </h2>
                <button
                  onClick={() => navigate('/dashboard/crm/leads')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {urgentLeads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded-r-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{lead.customerName}</h3>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(lead.urgency)}`}>
                          {lead.urgency}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Budget: ${lead.budget?.toLocaleString()}
                      </span>
                      <button
                        onClick={() => navigate(`/dashboard/crm/customers/${lead.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Follow-ups */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="mr-2 text-yellow-600" size={20} />
                  Upcoming Follow-ups
                </h2>
                <button
                  onClick={() => navigate('/dashboard/crm/follow-ups')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {upcomingFollowUps.slice(0, 5).map((followUp) => (
                  <div key={followUp.id} className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{followUp.title}</h3>
                        <p className="text-sm text-gray-600">{followUp.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(followUp.priority)}`}>
                        {followUp.priority}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Due: {followUp.dueDate.toLocaleDateString()}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="mr-2 text-blue-600" size={20} />
                  Recent Activities
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'customer_action' ? 'bg-blue-500' :
                      activity.type === 'salesperson_action' ? 'bg-green-500' :
                      activity.type === 'ai_action' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <span className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - AI & Quick Stats */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bot className="mr-2 text-purple-600" size={20} />
                  AI Recommendations
                </h2>
                <button
                  onClick={() => navigate('/dashboard/crm/ai-recommendations')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {aiRecommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 text-sm">{rec.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{rec.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {rec.confidence}% confidence
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-xs">
                        Act Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="text-green-600 mr-2" size={16} />
                    <span className="text-sm text-gray-700">Financing Rate</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{metrics.financingConversionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="text-blue-600 mr-2" size={16} />
                    <span className="text-sm text-gray-700">Rental Rate</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{metrics.rentalConversionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="text-yellow-600 mr-2" size={16} />
                    <span className="text-sm text-gray-700">Satisfaction</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{metrics.customerSatisfactionScore}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="text-purple-600 mr-2" size={16} />
                    <span className="text-sm text-gray-700">Messages</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{recentCommunications.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/dashboard/crm/communications')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Communication Center</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/dashboard/crm/financing')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Financing Workflow</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/dashboard/crm/rentals')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Rental Workflow</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/dashboard/crm/analytics')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>Full Analytics</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

export default CRMDashboardPage
