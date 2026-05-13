import { useEffect, useState } from 'react'
import { 
  Car, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Target, 
  BarChart3,
  Activity,
  Clock,
  Plus,
  Eye
} from 'lucide-react'
import { DashboardCard } from '@/components/ui/DashboardCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CardSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { dashboardService } from '@/services/dashboardService'
import { inventoryService } from '@/services/inventoryService'
import { leadsService } from '@/services/leadsService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function DashboardHome() {
  const [metrics, setMetrics] = useState<any>(null)
  const [kpiCards, setKpiCards] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [inventoryTrends, setInventoryTrends] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [
        dashboardMetrics,
        kpiData,
        sales,
        trends,
        activity
      ] = await Promise.all([
        dashboardService.getDashboardMetrics(),
        dashboardService.getKpiCards(),
        dashboardService.getSalesData(),
        dashboardService.getInventoryTrends(),
        dashboardService.getRecentActivity()
      ])

      setMetrics(dashboardMetrics)
      setKpiCards(kpiData)
      setSalesData(sales)
      setInventoryTrends(trends)
      setRecentActivity(activity)
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    const icons: any = {
      Car: <Car className="w-6 h-6" />,
      TrendingUp: <TrendingUp className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      DollarSign: <DollarSign className="w-6 h-6" />,
      Calendar: <Calendar className="w-6 h-6" />,
      Target: <Target className="w-6 h-6" />,
      BarChart3: <BarChart3 className="w-6 h-6" />,
      Activity: <Activity className="w-6 h-6" />
    }
    return icons[iconName] || <Activity className="w-6 h-6" />
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Theme Test Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Theme Test</h2>
        <p className="text-gray-600 dark:text-gray-400">
          If you can see this text change color when switching themes, the theme system is working!
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-center">
            <span className="text-gray-800 dark:text-gray-200 text-sm">Test 1</span>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-center">
            <span className="text-blue-800 dark:text-blue-200 text-sm">Test 2</span>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center">
            <span className="text-green-800 dark:text-green-200 text-sm">Test 3</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">Welcome back to Eagle Vision Edge</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadDashboardData} className="w-full sm:w-auto">
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards?.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                {getIcon(card.icon)}
              </div>
              <span className={`text-2xl font-bold ${
                card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.value}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{card.title}</h3>
            <div className={`text-xs mt-1 ${
              card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="target" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={inventoryTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="available" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="sold" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              New Lead
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Test Drive
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity?.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.priority === 'high' ? 'bg-red-500' :
                  activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

