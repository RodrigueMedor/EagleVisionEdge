// Mock Analytics Service
import {
  mockAnalyticsMetrics,
  mockSalesChartData,
  mockRevenueChartData,
  mockLeadStatusDistribution,
  mockInventoryStatusDistribution,
} from '@/data/mockAnalytics'

export const analyticsService = {
  async getMetrics(): Promise<typeof mockAnalyticsMetrics> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockAnalyticsMetrics
  },

  async getSalesData(period: 'month' | 'quarter' | 'year' = 'month'): Promise<typeof mockSalesChartData> {
    await new Promise(resolve => setTimeout(resolve, 300))
    // In a real app, this would filter based on period
    return mockSalesChartData
  },

  async getRevenueData(period: 'month' | 'quarter' | 'year' = 'month'): Promise<typeof mockRevenueChartData> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockRevenueChartData
  },

  async getLeadStatusDistribution(): Promise<typeof mockLeadStatusDistribution> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockLeadStatusDistribution
  },

  async getInventoryStatusDistribution(): Promise<typeof mockInventoryStatusDistribution> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInventoryStatusDistribution
  },

  async getConversionFunnel(): Promise<
    Array<{ stage: string; count: number; conversionRate: number }>
  > {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [
      { stage: 'Leads', count: 24, conversionRate: 100 },
      { stage: 'Contacted', count: 16, conversionRate: 67 },
      { stage: 'Qualified', count: 12, conversionRate: 75 },
      { stage: 'Test Drive', count: 8, conversionRate: 67 },
      { stage: 'Won', count: 2, conversionRate: 25 },
    ]
  },

  async getTopSellingModels(): Promise<
    Array<{ model: string; sales: number; revenue: number }>
  > {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [
      { model: 'Toyota Camry', sales: 5, revenue: 109975 },
      { model: 'Chevrolet Equinox', sales: 3, revenue: 71985 },
      { model: 'Kia Sorento', sales: 2, revenue: 53990 },
      { model: 'Honda Civic', sales: 2, revenue: 35990 },
      { model: 'Ford F-150', sales: 1, revenue: 28995 },
    ]
  },

  async getSalesRepPerformance(): Promise<
    Array<{ name: string; leads: number; sales: number; revenue: number }>
  > {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [
      { name: 'John Smith', leads: 12, sales: 3, revenue: 89985 },
      { name: 'Sarah Johnson', leads: 10, sales: 2, revenue: 56990 },
      { name: 'Mike Davis', leads: 8, sales: 2, revenue: 45985 },
    ]
  },
}

