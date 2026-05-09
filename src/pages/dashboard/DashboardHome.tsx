import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react'
import Card, { StatusBadge } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { inventoryService } from '@/services/inventoryService'
import { leadsService } from '@/services/leadsService'
import { analyticsService } from '@/services/analyticsService'

export default function DashboardHome() {
  const [stats, setStats] = useState<{
    inventory: any
    leads: any
    analytics: any
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const [invStats, leadStats, analytics] = await Promise.all([
        inventoryService.getInventoryStats(),
        leadsService.getLeadStats(),
        analyticsService.getMetrics(),
      ])

      setStats({
        inventory: invStats,
        leads: leadStats,
        analytics,
      })
    } catch (err) {
      console.error('Failed to load stats', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back to Eagle Vision Edge</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Inventory</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats?.inventory?.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats?.inventory?.available || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Leads</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats?.leads?.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                ${(stats?.analytics?.monthlyRevenue / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start" size="md">
              + Add Vehicle
            </Button>
            <Button variant="secondary" className="w-full justify-start" size="md">
              + New Lead
            </Button>
            <Button variant="secondary" className="w-full justify-start" size="md">
              View Reports
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-primary mb-4">Inventory Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available</span>
              <StatusBadge status={`${stats?.inventory?.available || 0}`} variant="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sold</span>
              <StatusBadge status={`${stats?.inventory?.sold || 0}`} variant="error" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rented</span>
              <StatusBadge status={`${stats?.inventory?.rented || 0}`} variant="warning" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

