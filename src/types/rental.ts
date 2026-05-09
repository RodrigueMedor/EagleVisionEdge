export interface Rental {
  id: string
  vehicleId: string
  customerId: string
  startDate: Date
  endDate: Date
  dailyRate: number
  totalCost: number
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

