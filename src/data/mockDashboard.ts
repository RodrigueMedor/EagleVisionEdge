import { DashboardMetrics, RecentActivity, SalesData, InventoryTrend, LeadConversionData, FinancingRequestData, RentalActivityData } from '@/types/dashboard'

export const mockDashboardMetrics: DashboardMetrics = {
  totalInventory: 47,
  vehiclesSold: 12,
  activeLeads: 28,
  financingRequests: 15,
  rentalsActive: 8,
  monthlyRevenue: 485000,
  conversionRate: 18.5,
  averageSalePrice: 32450,
  daysOnLot: 42,
  customerSatisfaction: 4.6
}

export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'activity_001',
    type: 'new_lead',
    title: 'New Lead Received',
    description: 'John Doe submitted a lead for Toyota Camry',
    timestamp: new Date('2024-11-20T10:30:00'),
    entityId: 'lead_001',
    userId: 'system',
    priority: 'high'
  },
  {
    id: 'activity_002',
    type: 'vehicle_sold',
    title: 'Vehicle Sold',
    description: 'Robert Thompson purchased Toyota Camry 2021',
    timestamp: new Date('2024-11-20T09:15:00'),
    entityId: 'vehicle_1',
    userId: 'sales_rep_02',
    priority: 'high'
  },
  {
    id: 'activity_003',
    type: 'financing_request',
    title: 'Financing Application',
    description: 'Emily Chen submitted financing for Mercedes C300',
    timestamp: new Date('2024-11-19T16:45:00'),
    entityId: 'financing_001',
    userId: 'system',
    priority: 'medium'
  },
  {
    id: 'activity_004',
    type: 'rental_reservation',
    title: 'Rental Booked',
    description: 'James Wilson reserved Ram 1500 for 3 days',
    timestamp: new Date('2024-11-19T14:20:00'),
    entityId: 'rental_001',
    userId: 'staff_01',
    priority: 'medium'
  },
  {
    id: 'activity_005',
    type: 'customer_update',
    title: 'Customer Information Updated',
    description: 'Sarah Miller updated contact information',
    timestamp: new Date('2024-11-19T11:30:00'),
    entityId: 'customer_001',
    userId: 'sales_rep_01',
    priority: 'low'
  },
  {
    id: 'activity_006',
    type: 'new_lead',
    title: 'New Lead from Website',
    description: 'Michael Johnson interested in Honda CR-V',
    timestamp: new Date('2024-11-19T10:00:00'),
    entityId: 'lead_003',
    userId: 'system',
    priority: 'high'
  },
  {
    id: 'activity_007',
    type: 'financing_request',
    title: 'Financing Approved',
    description: 'Linda Davis financing application approved',
    timestamp: new Date('2024-11-18T15:30:00'),
    entityId: 'financing_002',
    userId: 'finance_manager',
    priority: 'medium'
  },
  {
    id: 'activity_008',
    type: 'vehicle_sold',
    title: 'Another Vehicle Sold',
    description: 'Patricia Martinez purchased Honda Civic',
    timestamp: new Date('2024-11-18T12:45:00'),
    entityId: 'vehicle_2',
    userId: 'sales_rep_02',
    priority: 'high'
  }
]

export const mockSalesData: SalesData[] = [
  { month: 'Jan', sales: 8, revenue: 320000, target: 350000 },
  { month: 'Feb', sales: 10, revenue: 425000, target: 350000 },
  { month: 'Mar', sales: 12, revenue: 518000, target: 400000 },
  { month: 'Apr', sales: 9, revenue: 382000, target: 400000 },
  { month: 'May', sales: 15, revenue: 645000, target: 450000 },
  { month: 'Jun', sales: 11, revenue: 468000, target: 450000 },
  { month: 'Jul', sales: 13, revenue: 562000, target: 500000 },
  { month: 'Aug', sales: 14, revenue: 605000, target: 500000 },
  { month: 'Sep', sales: 10, revenue: 428000, target: 500000 },
  { month: 'Oct', sales: 16, revenue: 695000, target: 550000 },
  { month: 'Nov', sales: 12, revenue: 485000, target: 550000 },
  { month: 'Dec', sales: 0, revenue: 0, target: 600000 }
]

export const mockInventoryTrends: InventoryTrend[] = [
  { date: '2024-11-01', total: 45, available: 38, sold: 5, reserved: 2 },
  { date: '2024-11-02', total: 47, available: 40, sold: 5, reserved: 2 },
  { date: '2024-11-03', total: 47, available: 39, sold: 6, reserved: 2 },
  { date: '2024-11-04', total: 49, available: 41, sold: 6, reserved: 2 },
  { date: '2024-11-05', total: 49, available: 40, sold: 7, reserved: 2 },
  { date: '2024-11-06', total: 51, available: 42, sold: 7, reserved: 2 },
  { date: '2024-11-07', total: 51, available: 41, sold: 8, reserved: 2 },
  { date: '2024-11-08', total: 53, available: 43, sold: 8, reserved: 2 },
  { date: '2024-11-09', total: 53, available: 42, sold: 9, reserved: 2 },
  { date: '2024-11-10', total: 55, available: 44, sold: 9, reserved: 2 },
  { date: '2024-11-11', total: 55, available: 43, sold: 10, reserved: 2 },
  { date: '2024-11-12', total: 57, available: 45, sold: 10, reserved: 2 },
  { date: '2024-11-13', total: 57, available: 44, sold: 11, reserved: 2 },
  { date: '2024-11-14', total: 59, available: 46, sold: 11, reserved: 2 },
  { date: '2024-11-15', total: 59, available: 45, sold: 12, reserved: 2 },
  { date: '2024-11-16', total: 61, available: 47, sold: 12, reserved: 2 },
  { date: '2024-11-17', total: 61, available: 46, sold: 13, reserved: 2 },
  { date: '2024-11-18', total: 63, available: 48, sold: 13, reserved: 2 },
  { date: '2024-11-19', total: 63, available: 47, sold: 14, reserved: 2 },
  { date: '2024-11-20', total: 65, available: 49, sold: 14, reserved: 2 }
]

export const mockLeadConversionData: LeadConversionData[] = [
  { stage: 'New', count: 28, conversionRate: 100 },
  { stage: 'Contacted', count: 22, conversionRate: 78.6 },
  { stage: 'Appointment Scheduled', count: 18, conversionRate: 64.3 },
  { stage: 'Financing Pending', count: 15, conversionRate: 53.6 },
  { stage: 'Negotiation', count: 12, conversionRate: 42.9 },
  { stage: 'Sold', count: 8, conversionRate: 28.6 },
  { stage: 'Closed', count: 10, conversionRate: 35.7 }
]

export const mockFinancingRequestData: FinancingRequestData[] = [
  { date: '2024-11-01', requests: 3, approved: 2, rejected: 0, pending: 1 },
  { date: '2024-11-02', requests: 2, approved: 1, rejected: 0, pending: 1 },
  { date: '2024-11-03', requests: 4, approved: 3, rejected: 1, pending: 0 },
  { date: '2024-11-04', requests: 1, approved: 1, rejected: 0, pending: 0 },
  { date: '2024-11-05', requests: 3, approved: 2, rejected: 0, pending: 1 },
  { date: '2024-11-06', requests: 2, approved: 1, rejected: 1, pending: 0 },
  { date: '2024-11-07', requests: 5, approved: 3, rejected: 1, pending: 1 },
  { date: '2024-11-08', requests: 3, approved: 2, rejected: 0, pending: 1 },
  { date: '2024-11-09', requests: 4, approved: 3, rejected: 1, pending: 0 },
  { date: '2024-11-10', requests: 2, approved: 1, rejected: 0, pending: 1 },
  { date: '2024-11-11', requests: 3, approved: 2, rejected: 0, pending: 1 },
  { date: '2024-11-12', requests: 1, approved: 1, rejected: 0, pending: 0 },
  { date: '2024-11-13', requests: 4, approved: 2, rejected: 1, pending: 1 },
  { date: '2024-11-14', requests: 2, approved: 2, rejected: 0, pending: 0 },
  { date: '2024-11-15', requests: 3, approved: 2, rejected: 0, pending: 1 },
  { date: '2024-11-16', requests: 5, approved: 3, rejected: 1, pending: 1 },
  { date: '2024-11-17', requests: 2, approved: 1, rejected: 0, pending: 1 },
  { date: '2024-11-18', requests: 4, approved: 3, rejected: 1, pending: 0 },
  { date: '2024-11-19', requests: 3, approved: 2, rejected: 0, pending: 1 },
  { date: '2024-11-20', requests: 2, approved: 1, rejected: 0, pending: 1 }
]

export const mockRentalActivityData: RentalActivityData[] = [
  { date: '2024-11-01', active: 6, new: 2, completed: 3, revenue: 1200 },
  { date: '2024-11-02', active: 7, new: 3, completed: 2, revenue: 1500 },
  { date: '2024-11-03', active: 8, new: 2, completed: 1, revenue: 1800 },
  { date: '2024-11-04', active: 7, new: 1, completed: 2, revenue: 2100 },
  { date: '2024-11-05', active: 9, new: 4, completed: 2, revenue: 2400 },
  { date: '2024-11-06', active: 8, new: 2, completed: 3, revenue: 2700 },
  { date: '2024-11-07', active: 10, new: 3, completed: 1, revenue: 3000 },
  { date: '2024-11-08', active: 9, new: 2, completed: 3, revenue: 3300 },
  { date: '2024-11-09', active: 11, new: 4, completed: 2, revenue: 3600 },
  { date: '2024-11-10', active: 10, new: 2, completed: 3, revenue: 3900 },
  { date: '2024-11-11', active: 12, new: 3, completed: 1, revenue: 4200 },
  { date: '2024-11-12', active: 11, new: 2, completed: 3, revenue: 4500 },
  { date: '2024-11-13', active: 13, new: 4, completed: 2, revenue: 4800 },
  { date: '2024-11-14', active: 12, new: 2, completed: 3, revenue: 5100 },
  { date: '2024-11-15', active: 14, new: 3, completed: 1, revenue: 5400 },
  { date: '2024-11-16', active: 13, new: 2, completed: 3, revenue: 5700 },
  { date: '2024-11-17', active: 15, new: 4, completed: 2, revenue: 6000 },
  { date: '2024-11-18', active: 14, new: 2, completed: 3, revenue: 6300 },
  { date: '2024-11-19', active: 16, new: 3, completed: 1, revenue: 6600 },
  { date: '2024-11-20', active: 15, new: 2, completed: 3, revenue: 6900 }
]
