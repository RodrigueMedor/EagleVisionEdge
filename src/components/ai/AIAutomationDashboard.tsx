import { useState, useEffect } from 'react'
import { Activity, Clock, CheckCircle, AlertCircle, TrendingUp, Users, MessageSquare, Zap, BarChart3, Loader2 } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { AIAnalytics, AIActivity, AIWorkflow } from '@/types/ai'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

interface AIAutomationDashboardProps {
  className?: string
}

export default function AIAutomationDashboard({ className }: AIAutomationDashboardProps) {
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null)
  const [activities, setActivities] = useState<AIActivity[]>([])
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'activity'>('overview')

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [selectedTimeRange])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load analytics
      const analyticsResponse = await aiService.getAnalytics()
      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data)
      }

      // Load activity log
      const activityResponse = await aiService.getActivityLog(20)
      if (activityResponse.success && activityResponse.data) {
        setActivities(activityResponse.data)
      }

      // Load mock workflows
      const mockWorkflows: AIWorkflow[] = [
        {
          id: 'workflow-1',
          name: 'Lead Qualification Automation',
          type: 'lead_qualification',
          status: 'completed',
          trigger: 'new_lead',
          actions: [
            {
              id: 'action-1',
              type: 'ai_qualification',
              name: 'AI Lead Qualification',
              status: 'completed',
              timestamp: new Date(Date.now() - 3600000)
            },
            {
              id: 'action-2',
              type: 'crm_update',
              name: 'Update CRM',
              status: 'completed',
              timestamp: new Date(Date.now() - 1800000)
            },
            {
              id: 'action-3',
              type: 'notification',
              name: 'Send Notification',
              status: 'completed',
              timestamp: new Date(Date.now() - 600000)
            }
          ],
          createdAt: new Date(Date.now() - 7200000),
          updatedAt: new Date(Date.now() - 600000),
          completedAt: new Date(Date.now() - 600000)
        },
        {
          id: 'workflow-2',
          name: 'Follow-up Sequence',
          type: 'followup',
          status: 'in_progress',
          trigger: 'lead_created',
          actions: [
            {
              id: 'action-4',
              type: 'send_email',
              name: 'Send Initial Email',
              status: 'completed',
              timestamp: new Date(Date.now() - 1800000)
            },
            {
              id: 'action-5',
              type: 'schedule_followup',
              name: 'Schedule Follow-up',
              status: 'pending',
              timestamp: new Date(Date.now() + 86400000)
            }
          ],
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 600000)
        },
        {
          id: 'workflow-3',
          name: 'Appointment Scheduling',
          type: 'appointment',
          status: 'pending',
          trigger: 'appointment_request',
          actions: [
            {
              id: 'action-6',
              type: 'check_availability',
              name: 'Check Availability',
              status: 'pending',
              timestamp: new Date()
            }
          ],
          createdAt: new Date(Date.now() - 1200000),
          updatedAt: new Date(Date.now() - 1200000)
        }
      ]
      setWorkflows(mockWorkflows)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'in_progress':
        return Loader2
      case 'pending':
        return Clock
      case 'failed':
        return AlertCircle
      default:
        return Activity
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (isLoading) {
    return (
      <Card className={clsx("p-6", className)}>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading AI automation dashboard...</p>
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Automation Dashboard</h3>
            <p className="text-sm text-gray-600">Monitor AI-powered workflows and performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={loadDashboardData}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'workflows', label: 'Workflows', icon: Zap },
            { id: 'activity', label: 'Activity', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">+12%</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatNumber(analytics.totalConversations)}</p>
                <p className="text-sm text-blue-700">Total Conversations</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{formatNumber(analytics.totalLeadsGenerated)}</p>
                <p className="text-sm text-green-700">Leads Generated</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">+15%</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{(analytics.qualificationRate * 100).toFixed(1)}%</p>
                <p className="text-sm text-purple-700">Qualification Rate</p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8 text-orange-600" />
                  <span className="text-sm text-orange-600 font-medium">+25%</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{formatNumber(analytics.automationWorkflowsCompleted)}</p>
                <p className="text-sm text-orange-700">Workflows Completed</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Conversation Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Response Time</span>
                    <span className="text-sm font-medium">{analytics.averageResponseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Conversation Length</span>
                    <span className="text-sm font-medium">{analytics.averageConversationLength} msgs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-medium">4.8/5.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Popular Topics</h4>
                <div className="space-y-2">
                  {analytics.popularTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{topic.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.random() * 60 + 20}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{Math.floor(Math.random() * 100 + 20)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Active Workflows</h4>
              <Button variant="primary" size="sm">
                Create New Workflow
              </Button>
            </div>
            
            {workflows.map((workflow) => (
              <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">{workflow.name}</h5>
                    <p className="text-sm text-gray-600">Trigger: {workflow.trigger.replace('_', ' ')}</p>
                  </div>
                  <div className={clsx(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    getStatusColor(workflow.status)
                  )}>
                    {workflow.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="space-y-2">
                  {workflow.actions.map((action, index) => {
                    const StatusIcon = getStatusIcon(action.status)
                    return (
                      <div key={action.id} className="flex items-center gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <StatusIcon className={clsx("w-3 h-3", action.status === 'in_progress' && "animate-spin")} />
                        </div>
                        <span className="text-gray-700">{action.name}</span>
                        <span className="text-gray-500 text-xs ml-auto">
                          {formatTime(action.timestamp)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Recent Activity</h4>
            
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
