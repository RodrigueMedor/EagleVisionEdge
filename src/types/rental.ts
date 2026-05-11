export interface Rental {
  id: string
  vehicleId: string
  customerId: string
  customerName?: string
  customerEmail?: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: number
  vehicleVin?: string
  startDate: Date
  endDate: Date
  dailyRate: number
  totalCost?: number
  totalAmount?: number
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type RentalStatus = 'pending' | 'active' | 'completed' | 'cancelled'

