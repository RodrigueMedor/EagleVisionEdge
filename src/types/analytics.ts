export interface AnalyticsMetrics {
  totalInventory: number
  vehiclesSold: number
  activeLeads: number
  monthlyRevenue: number
  conversionRate: number
  averageSalePrice: number
  daysOnLot: number
  customerSatisfaction: number
  timestamp: Date
}

export interface ChartDataPoint {
  label: string
  value: number
  timestamp?: Date
}

