import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  Settings,
  RefreshCw,
  Eye,
  Bell,
  Smartphone,
  Info,
  AlertCircle,
  X
} from 'lucide-react'
import { predictiveMaintenanceService } from '@/services/predictiveMaintenanceService'
import { 
  MaintenanceAlert, 
  VehicleTelemetry, 
  MaintenanceAnalytics,
  ServiceRecommendation,
  IoTDevice
} from '@/types/predictiveMaintenance'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const PredictiveMaintenancePage: React.FC = () => {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([])
  const [telemetry, setTelemetry] = useState<VehicleTelemetry | null>(null)
  const [analytics, setAnalytics] = useState<MaintenanceAnalytics | null>(null)
  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([])
  const [iotDevices, setIotDevices] = useState<IoTDevice[]>([])
  const [selectedAlert, setSelectedAlert] = useState<MaintenanceAlert | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [alertsResponse, telemetryResponse, analyticsResponse, recommendationsResponse, devicesResponse] = await Promise.all([
        predictiveMaintenanceService.getMaintenanceAlerts(),
        predictiveMaintenanceService.getVehicleTelemetry('vehicle_001'),
        predictiveMaintenanceService.getMaintenanceAnalytics(),
        predictiveMaintenanceService.getServiceRecommendations('vehicle_001'),
        predictiveMaintenanceService.getIoTDevices('vehicle_001')
      ])

      if (alertsResponse.success) {
        setAlerts(alertsResponse.data)
      }

      if (telemetryResponse.success) {
        setTelemetry(telemetryResponse.data)
      }

      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data)
      }

      if (recommendationsResponse.success) {
        setRecommendations(recommendationsResponse.data)
      }

      if (devicesResponse.success) {
        setIotDevices(devicesResponse.data)
      }

    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await predictiveMaintenanceService.acknowledgeMaintenanceAlert(alertId)
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledgedAt: new Date() }
          : alert
      ))
    } catch (err) {
      console.error('Failed to acknowledge alert:', err)
    }
  }

  const handleScheduleService = async (alert: MaintenanceAlert) => {
    try {
      await predictiveMaintenanceService.scheduleMaintenance({
        vehicleId: alert.vehicleId,
        customerId: alert.customerId,
        title: `Service for ${alert.title}`,
        description: alert.description,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Schedule for next week
        estimatedDuration: alert.estimatedTime,
        estimatedCost: alert.estimatedCost,
        priority: alert.priority as 'low' | 'medium' | 'high',
        status: 'scheduled',
        parts: alert.partsNeeded,
        reminders: []
      })
      
      setAlerts(alerts.map(a => 
        a.id === alert.id 
          ? { ...a, scheduledAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
          : a
      ))
    } catch (err) {
      console.error('Failed to schedule service:', err)
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPriorityIcon = (priority: string) => {
    const icons = {
      critical: <AlertTriangle className="text-red-600" size={20} />,
      high: <AlertCircle className="text-orange-600" size={20} />,
      medium: <Bell className="text-yellow-600" size={20} />,
      low: <Info className="text-blue-600" size={20} />
    }
    return icons[priority as keyof typeof icons] || <Info className="text-gray-600" size={20} />
  }

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      immediate: 'text-red-600 bg-red-50',
      within_week: 'text-orange-600 bg-orange-50',
      within_month: 'text-yellow-600 bg-yellow-50',
      within_3_months: 'text-blue-600 bg-blue-50'
    }
    return colors[urgency as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    return alert.priority === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Predictive Maintenance</h1>
            <p className="text-gray-600 mt-1">AI-powered vehicle health monitoring and maintenance predictions</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                showAnalytics 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Activity size={18} className="mr-2" />
              {showAnalytics ? 'Show Alerts' : 'Show Analytics'}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="text-red-600 mr-2" size={20} />
              <span className="text-xl sm:text-2xl font-bold text-red-600">
                {alerts.filter(a => a.priority === 'critical').length}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Critical Alerts</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-orange-600 mr-2" size={20} />
              <span className="text-xl sm:text-2xl font-bold text-orange-600">
                {alerts.filter(a => a.urgency === 'immediate').length}
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">Immediate Action</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-green-600 mr-2" size={20} />
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                {analytics?.preventedBreakdowns || 0}
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">Breakdowns Prevented</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-blue-600 mr-2" size={20} />
              <span className="text-xl sm:text-2xl font-bold text-blue-600">
                ${analytics?.costSavings?.toLocaleString() || '0'}
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">Cost Savings</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setFilter(priority as any)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  filter === priority
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!showAnalytics ? (
        /* Alerts View */
        <div className="space-y-6">
          {/* Alert Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredAlerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 ${getPriorityColor(alert.priority)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getPriorityIcon(alert.priority)}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.type.replace('_', ' ').replace(/\b\w/g, ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className={`text-xs font-medium ${getUrgencyColor(alert.urgency)}`}>
                      {alert.urgency.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{alert.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Predicted Issue:</h4>
                  <p className="text-gray-700 mb-3">{alert.predictedIssue}</p>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Confidence:</span> {alert.confidence}%
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Estimated Cost:</span> ${alert.estimatedCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Estimated Time:</span> {alert.estimatedTime} hours
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Action:</h4>
                  <p className="text-gray-700 mb-3">{alert.recommendedAction}</p>
                  
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Parts Needed:</h5>
                    <div className="space-y-1">
                      {alert.partsNeeded.map((part) => (
                        <div key={part.id} className="flex items-center justify-between text-sm">
                          <span>{part.name}</span>
                          <span className="font-medium">${part.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Tools Needed:</h5>
                    <div className="flex flex-wrap gap-2">
                      {alert.toolsNeeded.map((tool, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Prevention Tips:</h5>
                    <ul className="space-y-1">
                      {alert.preventionTips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Created: {alert.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.acknowledgedAt && (
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.urgency !== 'scheduled' && (
                      <button
                        onClick={() => handleScheduleService(alert)}
                        className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Schedule Service
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* IoT Device Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Smartphone className="mr-2" size={24} />
              IoT Device Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {iotDevices.map((device) => (
                <div key={device.id} className={`border rounded-lg p-4 ${
                  device.isActive 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{device.model}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      device.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{device.type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Signal:</span>
                      <span className="font-medium">{device.signalStrength}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Battery:</span>
                      <span className="font-medium">{device.batteryLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Points:</span>
                      <span className="font-medium">{device.dataPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Seen:</span>
                      <span className="font-medium">{device.lastSeen.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Analytics View */
        <div className="space-y-6">
          {analytics && (
            <>
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Alerts</h3>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalAlerts}</p>
                  <p className="text-sm text-gray-600">Last 30 days</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Accuracy</h3>
                  <p className="text-3xl font-bold text-green-600">{analytics.predictiveAccuracy}%</p>
                  <p className="text-sm text-gray-600">Model performance</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Uptime</h3>
                  <p className="text-3xl font-bold text-purple-600">{analytics.uptime}%</p>
                  <p className="text-sm text-gray-600">Vehicle availability</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Savings</h3>
                  <p className="text-3xl font-bold text-orange-600">${analytics.costSavings.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Preventive maintenance</p>
                </div>
              </div>

              {/* Common Issues */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Common Issues</h2>
                <div className="space-y-3">
                  {analytics.commonIssues.map((issue) => (
                    <div key={issue.issueType} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                        <span className="font-medium">{issue.issueType.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{issue.count}</div>
                        <div className="text-sm text-gray-600">{issue.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${analytics.costAnalysis.preventive.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Preventive</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">${analytics.costAnalysis.corrective.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Corrective</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${analytics.costAnalysis.savings.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Savings</p>
                  </div>
                </div>
              </div>

              {/* Service Recommendations */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Service Recommendations</h2>
                <div className="space-y-4">
                  {recommendations.slice(0, 5).map((rec) => (
                    <div key={rec.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          rec.priority === 'low' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{rec.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">Estimated Cost:</span>
                          <span className="font-medium">${rec.estimatedCost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Estimated Time:</span>
                          <span className="font-medium">{rec.estimatedTime} hours</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {rec.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Expires: {rec.expiresAt?.toLocaleDateString()}
                        </div>
                        <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-screen overflow-y-auto m-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Alert Details</h2>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Alert Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Type:</span> {selectedAlert.type.replace('_', ' ').toUpperCase()}</div>
                    <div><span className="text-gray-600">Priority:</span> 
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(selectedAlert.priority)}`}>
                        {selectedAlert.priority.toUpperCase()}
                      </span>
                    </div>
                    <div><span className="text-gray-600">Confidence:</span> {selectedAlert.confidence}%</div>
                    <div><span className="text-gray-600">Created:</span> {selectedAlert.createdAt.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Cost & Time</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Estimated Cost:</span> ${selectedAlert.estimatedCost.toLocaleString()}</div>
                    <div><span className="text-gray-600">Estimated Time:</span> {selectedAlert.estimatedTime} hours</div>
                    <div><span className="text-gray-600">Urgency:</span> 
                      <span className={`font-medium ${getUrgencyColor(selectedAlert.urgency)}`}>
                        {selectedAlert.urgency.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Recommended Action</h3>
                <p className="text-gray-700 mb-4">{selectedAlert.recommendedAction}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Parts Needed</h3>
                <div className="space-y-2">
                  {selectedAlert.partsNeeded.map((part) => (
                    <div key={part.id} className="flex items-center justify-between text-sm">
                      <span>{part.name} ({part.partNumber})</span>
                      <span className="font-medium">${part.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tools Required</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAlert.toolsNeeded.map((tool, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Prevention Tips</h3>
                <ul className="space-y-1">
                  {selectedAlert.preventionTips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              {!selectedAlert.acknowledgedAt && (
                <button
                  onClick={() => handleAcknowledgeAlert(selectedAlert.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Acknowledge Alert
                </button>
              )}
              {selectedAlert.urgency !== 'scheduled' && (
                <button
                  onClick={() => handleScheduleService(selectedAlert)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Schedule Service
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictiveMaintenancePage
