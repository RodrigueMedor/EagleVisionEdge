export interface DealershipSettings {
  id: string
  name: string
  logo?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    website: string
  }
  businessHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  branding: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    theme: 'light' | 'dark' | 'auto'
  }
  features: {
    financing: boolean
    rentals: boolean
    auctions: boolean
    tradeIns: boolean
    warranties: boolean
    delivery: boolean
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
  }
  notifications: NotificationSettings
  createdAt: Date
  updatedAt: Date
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  leadAlerts: boolean
  financingAlerts: boolean
  rentalAlerts: boolean
  inventoryAlerts: boolean
  systemUpdates: boolean
  marketingEmails: boolean
}

export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  dateFormat: string
  currency: string
  notifications: UserNotificationSettings
  dashboard: DashboardSettings
}

export interface UserNotificationSettings {
  desktop: boolean
  email: boolean
  sms: boolean
  leadAssigned: boolean
  leadStatusChanged: boolean
  vehicleSold: boolean
  financingApproved: boolean
  rentalBooked: boolean
  systemMaintenance: boolean
}

export interface DashboardSettings {
  defaultView: 'overview' | 'inventory' | 'leads' | 'analytics'
  widgets: string[]
  refreshInterval: number
  showCharts: boolean
  compactMode: boolean
}
