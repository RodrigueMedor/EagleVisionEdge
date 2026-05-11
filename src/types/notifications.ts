export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  createdAt: Date
  read: boolean
  entityId?: string
  entityType?: 'lead' | 'vehicle' | 'customer' | 'financing' | 'rental'
  actionUrl?: string
  priority: 'high' | 'medium' | 'low'
  userId?: string
}

export interface NotificationCenter {
  notifications: Notification[]
  unreadCount: number
  settings: NotificationSettings
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
}

export interface ToastNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  persistent?: boolean
  createdAt?: Date
  action?: {
    label: string
    onClick: () => void
  }
}
