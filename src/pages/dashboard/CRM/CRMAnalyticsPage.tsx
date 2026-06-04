import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Users,
  DollarSign,
  Phone,
  Clock,
  Star,
  Target,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Car
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { CRMDashboardData } from '@/types/crm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const CRMAnalyticsPage: React.FC = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<CRMDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<string>('30days')
  const [selectedMetric, setSelectedMetric] = useState<string>('all')

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange, selectedMetric])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await crmService.getCRMDashboardData()
      
      if (response.success) {
        setDashboardData(response.data)
      } else {
        setError(response.message || 'Failed to load analytics data')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getMetricChange = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, direction: 'neutral' as const }
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    }
  }

  const getChangeIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="text-green-600" size={16} />
      case 'down':
        return <ArrowDown className="text-red-600" size={16} />
      default:
        return <Minus className="text-gray-600" size={16} />
    }
  }

  const getChangeColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  // Mock data for charts
  const pipelineData = [
    { stage: 'New Lead', count: 45, value: 1125000 },
    { stage: 'Contacted', count: 32, value: 896000 },
    { stage: 'Test Drive', count: 18, value: 504000 },
    { stage: 'Financing', count: 12, value: 336000 },
    { stage: 'Negotiation', count: 8, value: 224000 },
    { stage: 'Sold', count: 5, value: 140000 }
  ]

  const leadSourceData = [
    { source: 'Website', leads: 35, conversion: 18.5 },
    { source: 'Phone Call', leads: 28, conversion: 22.1 },
    { source: 'Walk-in', leads: 22, conversion: 31.8 },
    { source: 'Referral', leads: 18, conversion: 44.4 },
    { source: 'Social Media', leads: 15, conversion: 12.3 },
    { source: 'Email Campaign', leads: 12, conversion: 8.9 }
  ]

  const monthlyTrendData = [
    { month: 'Jan', leads: 45, sales: 8, revenue: 224000 },
    { month: 'Feb', leads: 52, sales: 12, revenue: 336000 },
    { month: 'Mar', leads: 48, sales: 10, revenue: 280000 },
    { month: 'Apr', leads: 61, sales: 15, revenue: 420000 },
    { month: 'May', leads: 58, sales: 13, revenue: 364000 },
    { month: 'Jun', leads: 72, sales: 18, revenue: 504000 }
  ]

  const salespersonPerformance = [
    { name: 'John Smith', leads: 25, converted: 8, rate: 32.0, revenue: 224000 },
    { name: 'Sarah Johnson', leads: 22, converted: 9, rate: 40.9, revenue: 252000 },
    { name: 'Mike Davis', leads: 28, converted: 7, rate: 25.0, revenue: 196000 },
    { name: 'Lisa Wilson', leads: 20, converted: 6, rate: 30.0, revenue: 168000 },
    { name: 'Tom Brown', leads: 18, converted: 5, rate: 27.8, revenue: 140000 }
  ]

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
        <div className="text-red-600 mb-4">{error || 'Failed to load analytics data'}</div>
        <button
          onClick={loadAnalyticsData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const { metrics } = dashboardData

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive CRM performance metrics and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={() => navigate('/dashboard/crm')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to CRM
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download size={20} />
            </button>
            <button
              onClick={loadAnalyticsData}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="text-blue-600 mr-3" size={24} />
                <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
              </div>
              <div className="flex items-center">
                {getChangeIcon('up')}
                <span className={`ml-1 text-sm ${getChangeColor('up')}`}>12.5%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metrics.totalLeads}</div>
            <div className="text-sm text-gray-500 mt-2">
              {metrics.newLeadsThisMonth} new this month
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Target className="text-green-600 mr-3" size={24} />
                <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
              </div>
              <div className="flex items-center">
                {getChangeIcon('up')}
                <span className={`ml-1 text-sm ${getChangeColor('up')}`}>3.2%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metrics.conversionRate}%</div>
            <div className="text-sm text-gray-500 mt-2">
              Above industry average
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <DollarSign className="text-purple-600 mr-3" size={24} />
                <h3 className="text-sm font-medium text-gray-600">Revenue This Month</h3>
              </div>
              <div className="flex items-center">
                {getChangeIcon('up')}
                <span className={`ml-1 text-sm ${getChangeColor('up')}`}>18.7%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${metrics.revenueThisMonth.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              ${metrics.projectedRevenue.toLocaleString()} projected
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="text-orange-600 mr-3" size={24} />
                <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
              </div>
              <div className="flex items-center">
                {getChangeIcon('down')}
                <span className={`ml-1 text-sm ${getChangeColor('down')}`}>8.3%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metrics.averageResponseTime}m</div>
            <div className="text-sm text-gray-500 mt-2">
              {metrics.averageResponseTime < 60 ? 'Excellent' : 'Needs improvement'}
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pipeline Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline</h3>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              {pipelineData.map((stage, index) => (
                <div key={stage.stage} className="flex items-center">
                  <div className="w-32 text-sm font-medium text-gray-700">
                    {stage.stage}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium"
                        style={{ 
                          width: `${(stage.count / Math.max(...pipelineData.map(s => s.count))) * 100}%` 
                        }}
                      >
                        {stage.count}
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm text-gray-600">
                    ${stage.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
              <PieChart className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              {leadSourceData.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{source.leads} leads</span>
                    <span className="text-sm font-medium text-gray-900">{source.conversion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
              <LineChart className="text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              {monthlyTrendData.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${(month.leads / Math.max(...monthlyTrendData.map(m => m.leads))) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{month.leads}</span>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{month.sales}</span>
                    <span className="text-sm text-gray-900 w-20 text-right">
                      ${month.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
              <Star className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              {salespersonPerformance.map((person) => (
                <div key={person.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">{person.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{person.leads} leads</span>
                    <span className="text-sm font-medium text-gray-900">{person.converted} sales</span>
                    <span className="text-sm font-medium text-green-600">{person.rate}%</span>
                    <span className="text-sm text-gray-900">
                      ${person.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Activity className="text-blue-600 mr-3" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Financing Conversion</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {metrics.financingConversionRate}%
            </div>
            <div className="text-sm text-gray-500">
              68% approval rate
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Car className="text-green-600 mr-3" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Rental Conversion</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {metrics.rentalConversionRate}%
            </div>
            <div className="text-sm text-gray-500">
              42% booking rate
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Star className="text-yellow-600 mr-3" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {metrics.customerSatisfactionScore}
            </div>
            <div className="text-sm text-gray-500">
              Based on 156 reviews
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/dashboard/crm/leads')}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-left"
            >
              <Users className="text-blue-600 mb-2" size={24} />
              <div className="text-sm font-medium text-blue-900">View All Leads</div>
              <div className="text-xs text-blue-700">Manage your lead pipeline</div>
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/pipeline')}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-left"
            >
              <BarChart3 className="text-green-600 mb-2" size={24} />
              <div className="text-sm font-medium text-green-900">Sales Pipeline</div>
              <div className="text-xs text-green-700">Track deal progress</div>
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/ai-recommendations')}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-left"
            >
              <Activity className="text-purple-600 mb-2" size={24} />
              <div className="text-sm font-medium text-purple-900">AI Insights</div>
              <div className="text-xs text-purple-700">Get AI recommendations</div>
            </button>
            <button
              onClick={() => navigate('/dashboard/crm/communications')}
              className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 text-left"
            >
              <Phone className="text-orange-600 mb-2" size={24} />
              <div className="text-sm font-medium text-orange-900">Communications</div>
              <div className="text-xs text-orange-700">View customer interactions</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CRMAnalyticsPage
