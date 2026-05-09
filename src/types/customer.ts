export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  status: 'active' | 'inactive' | 'prospect'
  purchaseHistory: {
    vehicleId: string
    purchaseDate: Date
    price: number
  }[]
  segment: 'vip' | 'regular' | 'interested'
  communicationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
  notes?: {
    id: string
    content: string
    createdAt: Date
    createdBy: string
  }[]
  createdAt: Date
  updatedAt: Date
  name?: string // Computed field
}

