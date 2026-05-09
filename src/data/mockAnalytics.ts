import { AnalyticsMetrics, ChartDataPoint } from '@/types/analytics'

export const mockAnalyticsMetrics: AnalyticsMetrics = {
  totalInventory: 42,
  vehiclesSold: 18,
  activeLeads: 24,
  monthlyRevenue: 450000,
  conversionRate: 24,
  averageSalePrice: 23500,
  daysOnLot: 28,
  customerSatisfaction: 4.8,
  timestamp: new Date(),
}

export const mockSalesChartData: ChartDataPoint[] = [
  { label: 'Jan', value: 12, timestamp: new Date(2024, 0, 1) },
  { label: 'Feb', value: 19, timestamp: new Date(2024, 1, 1) },
  { label: 'Mar', value: 15, timestamp: new Date(2024, 2, 1) },
  { label: 'Apr', value: 25, timestamp: new Date(2024, 3, 1) },
  { label: 'May', value: 22, timestamp: new Date(2024, 4, 1) },
  { label: 'Jun', value: 30, timestamp: new Date(2024, 5, 1) },
  { label: 'Jul', value: 28, timestamp: new Date(2024, 6, 1) },
  { label: 'Aug', value: 35, timestamp: new Date(2024, 7, 1) },
  { label: 'Sep', value: 32, timestamp: new Date(2024, 8, 1) },
  { label: 'Oct', value: 28, timestamp: new Date(2024, 9, 1) },
  { label: 'Nov', value: 18, timestamp: new Date(2024, 10, 1) },
]

export const mockRevenueChartData: ChartDataPoint[] = [
  { label: 'Jan', value: 125000 },
  { label: 'Feb', value: 189000 },
  { label: 'Mar', value: 156000 },
  { label: 'Apr', value: 245000 },
  { label: 'May', value: 218000 },
  { label: 'Jun', value: 298000 },
  { label: 'Jul', value: 276000 },
  { label: 'Aug', value: 345000 },
  { label: 'Sep', value: 316000 },
  { label: 'Oct', value: 276000 },
  { label: 'Nov', value: 180000 },
]

export const mockLeadStatusDistribution = [
  { name: 'New', value: 6 },
  { name: 'Contacted', value: 8 },
  { name: 'Scheduled', value: 4 },
  { name: 'Negotiation', value: 3 },
  { name: 'Won', value: 2 },
]

export const mockInventoryStatusDistribution = [
  { name: 'Available', value: 32 },
  { name: 'Reserved', value: 4 },
  { name: 'Sold', value: 4 },
  { name: 'Rented', value: 2 },
]

