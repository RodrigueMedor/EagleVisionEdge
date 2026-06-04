import { useEffect, useState } from 'react'
import {
  Car, TrendingUp, Users, DollarSign, Calendar, Target, BarChart3,
  Activity, Plus, Eye, ArrowUpRight, ShoppingCart
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { dashboardService } from '@/services/dashboardService'
import { KpiCard, RecentActivity } from '@/types/dashboard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import { showError } from '@/lib/errorHandler'

export default function DashboardHome() {
  const [kpiCards, setKpiCards] = useState<KpiCard[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [inventoryTrends, setInventoryTrends] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [kpiData, sales, trends, activity] = await Promise.all([
        dashboardService.getKpiCards(),
        dashboardService.getSalesData(),
        dashboardService.getInventoryTrends(),
        dashboardService.getRecentActivity()
      ])
      setKpiCards(kpiData)
      setSalesData(sales)
      setInventoryTrends(trends)
      setRecentActivity(activity)
    } catch (err) {
      showError(err, 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string, color: string = 'primary') => {
    const iconColorMap: Record<string, string> = {
      primary: 'text-primary group-hover:text-white',
      accent: 'text-accent group-hover:text-white',
      gold: 'text-gold group-hover:text-white',
      blue: 'text-primary group-hover:text-white',
      green: 'text-accent group-hover:text-white',
      red: 'text-accent group-hover:text-white',
      yellow: 'text-gold group-hover:text-white',
      purple: 'text-primary group-hover:text-white',
      orange: 'text-gold group-hover:text-white',
    }
    const iconColor = iconColorMap[color] || iconColorMap.primary

    const icons: Record<string, JSX.Element> = {
      Car: <Car className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
      TrendingUp: <TrendingUp className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
      Users: <Users className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
      DollarSign: <DollarSign className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
      Calendar: <Calendar className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
      Target: <Target className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
      BarChart3: <BarChart3 className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
      Activity: <Activity className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />,
    }
    return icons[iconName] || <Activity className={`w-6 h-6 ${iconColor} transition-colors duration-300`} />
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      new_lead: <Users size={14} />,
      vehicle_sold: <Car size={14} />,
      financing_request: <ShoppingCart size={14} />,
      rental_reservation: <Calendar size={14} />,
      customer_update: <Users size={14} />,
    }
    return icons[type] || <Activity size={14} />
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl animate-pulse mb-4" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2 mb-2" />
              <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3 mb-6" />
              <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <span className="text-accent text-sm font-semibold tracking-wider uppercase">Dashboard</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mt-1">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back to Eagle Vision Edge</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={loadDashboardData}
            className="rounded-xl"
            size="sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards?.map((card, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                card.color === 'red' || card.color === 'green' ? 'bg-accent/10 group-hover:bg-accent' :
                card.color === 'yellow' || card.color === 'orange' ? 'bg-gold/10 group-hover:bg-gold' :
                'bg-primary/5 group-hover:bg-primary'
              }`}>
                {getIcon(card.icon, card.color)}
              </div>
              <span className={`text-2xl font-bold tracking-tight ${
                card.changeType === 'increase' ? 'text-green-600' : 'text-red-500'
              }`}>
                {card.value}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
            <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              card.changeType === 'increase'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${card.changeType === 'increase' ? 'bg-green-500' : 'bg-red-500'}`} />
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-primary">Monthly Sales</h3>
              <p className="text-sm text-gray-500">Revenue performance over time</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" /> Sales
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-200" /> Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="sales" fill="#0F172A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="target" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Trends */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-primary">Inventory Trends</h3>
              <p className="text-sm text-gray-500">Available, sold, and total vehicles</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Sold
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" /> Total
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={inventoryTrends}>
              <defs>
                <linearGradient id="availableGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="soldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              />
              <Area type="monotone" dataKey="available" stroke="#10b981" strokeWidth={2} fill="url(#availableGrad)" />
              <Area type="monotone" dataKey="sold" stroke="#f87171" strokeWidth={2} fill="url(#soldGrad)" />
              <Area type="monotone" dataKey="total" stroke="#0F172A" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-primary mb-1">Quick Actions</h3>
          <p className="text-sm text-gray-500 mb-5">Common tasks to get started</p>
          <div className="space-y-2">
            {[
              { icon: Plus, label: 'Add Vehicle', color: 'primary' },
              { icon: Users, label: 'New Lead', color: 'accent' },
              { icon: Eye, label: 'View Reports', color: 'gold' },
              { icon: Calendar, label: 'Schedule Test Drive', color: 'primary' },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  color === 'accent'
                    ? 'text-accent bg-accent/5 hover:bg-accent/10'
                    : color === 'gold'
                    ? 'text-gold bg-gold/5 hover:bg-gold/10'
                    : 'text-primary bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
                <ArrowUpRight size={14} className="ml-auto opacity-40" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-primary">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest updates across your dealership</p>
            </div>
            <button className="text-sm text-accent hover:text-red-700 font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-1">
            {recentActivity?.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activity.priority === 'high' ? 'bg-red-50 text-red-500' :
                  activity.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
