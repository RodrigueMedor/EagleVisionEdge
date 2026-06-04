import { useEffect, useState } from 'react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { DollarSign, Users, Car, Target, Clock, Star, Activity, Download } from 'lucide-react'
import { DashboardCard } from '@/components/ui/DashboardCard'
import { CardSkeleton } from '@/components/ui/LoadingSkeleton'
import Button from '@/components/ui/Button'
import { analyticsService } from '@/services/analyticsService'
import { dashboardService } from '@/services/dashboardService'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [salesData, setSalesData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [leadDistribution, setLeadDistribution] = useState<any[]>([])
  const [inventoryDistribution, setInventoryDistribution] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [
        analyticsMetrics,
        sales,
        revenue,
        leadDist,
        inventoryDist
      ] = await Promise.all([
        analyticsService.getMetrics(),
        dashboardService.getSalesData(),
        analyticsService.getRevenueData(),
        analyticsService.getLeadStatusDistribution(),
        analyticsService.getInventoryStatusDistribution()
      ])

      setMetrics(analyticsMetrics)
      setSalesData(sales)
      setRevenueData(revenue)
      setLeadDistribution(leadDist)
      setInventoryDistribution(inventoryDist)
    } catch (err) {
      console.error('Failed to load analytics', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-primary">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your dealership performance and insights</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your dealership performance and insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadAnalytics}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(metrics?.monthlyRevenue || 0)}
          change={12.5}
          changeType="increase"
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />

        <DashboardCard
          title="Vehicles Sold"
          value={metrics?.vehiclesSold || 0}
          change={8.2}
          changeType="increase"
          icon={<Car className="w-6 h-6" />}
          color="green"
        />

        <DashboardCard
          title="Active Leads"
          value={metrics?.activeLeads || 0}
          change={3.1}
          changeType="decrease"
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />

        <DashboardCard
          title="Conversion Rate"
          value={`${metrics?.conversionRate || 0}%`}
          change={2.4}
          changeType="increase"
          icon={<Target className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Units Sold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Average Sale Price"
          value={formatCurrency(metrics?.averageSalePrice || 0)}
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />

        <DashboardCard
          title="Days on Lot"
          value={metrics?.daysOnLot || 0}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />

        <DashboardCard
          title="Customer Satisfaction"
          value={`${metrics?.customerSatisfaction || 0}/5.0`}
          icon={<Star className="w-6 h-6" />}
          color="green"
        />
      </div>
    </div>
  )
}
