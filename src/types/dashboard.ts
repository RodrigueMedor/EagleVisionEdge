export interface DashboardMetrics {
  totalInventory: number
  vehiclesSold: number
  activeLeads: number
  financingRequests: number
  rentalsActive: number
  monthlyRevenue: number
  conversionRate: number
  averageSalePrice: number
  daysOnLot: number
  customerSatisfaction: number
}

export interface RecentActivity {
  id: string
  type: 'new_lead' | 'vehicle_sold' | 'financing_request' | 'rental_reservation' | 'customer_update'
  title: string
  description: string
  timestamp: Date
  entityId: string
  userId?: string
  priority: 'high' | 'medium' | 'low'
}

export interface SalesData {
  month: string
  sales: number
  revenue: number
  target: number
}

export interface InventoryTrend {
  date: string
  total: number
  available: number
  sold: number
  reserved: number
}

export interface LeadConversionData {
  stage: string
  count: number
  conversionRate: number
}

export interface FinancingRequestData {
  date: string
  requests: number
  approved: number
  rejected: number
  pending: number
}

export interface RentalActivityData {
  date: string
  active: number
  new: number
  completed: number
  revenue: number
}

export interface KpiCard {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: string
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange'
}
