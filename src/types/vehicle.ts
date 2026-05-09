export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'maintenance' | 'rented'

export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  monthlyEstimate?: number
  bodyType: string
  fuelType: string
  transmission: string
  exteriorColor: string
  interiorColor: string
  images: string[]
  description: string
  features: string[]
  status: VehicleStatus
  financingAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

