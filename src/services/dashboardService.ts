// Mock Dashboard Service
import { DashboardMetrics, RecentActivity, KpiCard, SalesData, InventoryTrend, LeadConversionData, FinancingRequestData, RentalActivityData } from '@/types/dashboard'
import { mockDashboardMetrics, mockRecentActivity, mockSalesData, mockInventoryTrends, mockLeadConversionData, mockFinancingRequestData, mockRentalActivityData } from '@/data/mockDashboard'

export const dashboardService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockDashboardMetrics
  },

  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockRecentActivity.slice(0, limit)
  },

  async getKpiCards(): Promise<KpiCard[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const metrics = await this.getDashboardMetrics()
    
    return [
      {
        title: 'Total Inventory',
        value: metrics.totalInventory,
        change: 5.2,
        changeType: 'increase',
        icon: 'Car',
        color: 'blue'
      },
      {
        title: 'Vehicles Sold',
        value: metrics.vehiclesSold,
        change: 12.3,
        changeType: 'increase',
        icon: 'TrendingUp',
        color: 'green'
      },
      {
        title: 'Active Leads',
        value: metrics.activeLeads,
        change: -2.1,
        changeType: 'decrease',
        icon: 'Users',
        color: 'yellow'
      },
      {
        title: 'Financing Requests',
        value: metrics.financingRequests,
        change: 8.7,
        changeType: 'increase',
        icon: 'DollarSign',
        color: 'purple'
      },
      {
        title: 'Active Rentals',
        value: metrics.rentalsActive,
        change: 3.4,
        changeType: 'increase',
        icon: 'Calendar',
        color: 'orange'
      },
      {
        title: 'Monthly Revenue',
        value: `$${metrics.monthlyRevenue.toLocaleString()}`,
        change: 15.8,
        changeType: 'increase',
        icon: 'CreditCard',
        color: 'green'
      },
      {
        title: 'Conversion Rate',
        value: `${metrics.conversionRate}%`,
        change: 1.2,
        changeType: 'increase',
        icon: 'Target',
        color: 'blue'
      },
      {
        title: 'Avg Sale Price',
        value: `$${metrics.averageSalePrice.toLocaleString()}`,
        change: -0.8,
        changeType: 'decrease',
        icon: 'BarChart',
        color: 'red'
      }
    ]
  },

  async getSalesData(period: 'month' | 'quarter' | 'year' = 'month'): Promise<SalesData[]> {
    await new Promise(resolve => setTimeout(resolve, 250))
    return mockSalesData
  },

  async getInventoryTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<InventoryTrend[]> {
    await new Promise(resolve => setTimeout(resolve, 250))
    return mockInventoryTrends
  },

  async getLeadConversionData(): Promise<LeadConversionData[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockLeadConversionData
  },

  async getFinancingRequestData(period: 'week' | 'month' = 'month'): Promise<FinancingRequestData[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockFinancingRequestData
  },

  async getRentalActivityData(period: 'week' | 'month' = 'month'): Promise<RentalActivityData[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockRentalActivityData
  },

  async refreshMetrics(): Promise<DashboardMetrics> {
    await new Promise(resolve => setTimeout(resolve, 500))
    // Simulate API call to refresh metrics
    return mockDashboardMetrics
  }
}
