// Mock Notification Service
import { Notification, NotificationCenter, ToastNotification } from '@/types/notifications'
import { mockNotifications } from '@/data/mockNotifications'

const notificationsData: Notification[] = mockNotifications.map(notification => ({
  ...notification,
  timestamp: new Date(notification.timestamp)
}))

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return notificationsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  async getUnreadNotifications(): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return notificationsData.filter(n => !n.read).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  async getNotificationById(id: string): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const notification = notificationsData.find(n => n.id === id)
    if (!notification) {
      throw new Error('Notification not found')
    }
    return notification
  },

  async markAsRead(id: string): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const notification = notificationsData.find(n => n.id === id)
    if (!notification) {
      throw new Error('Notification not found')
    }
    notification.read = true
    return notification
  },

  async markAllAsRead(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    notificationsData.forEach(n => n.read = true)
  },

  async deleteNotification(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = notificationsData.findIndex(n => n.id === id)
    if (index === -1) {
      throw new Error('Notification not found')
    }
    notificationsData.splice(index, 1)
  },

  async clearAllNotifications(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    notificationsData.length = 0
  },

  async getNotificationCenter(): Promise<NotificationCenter> {
    await new Promise(resolve => setTimeout(resolve, 250))
    const unreadCount = notificationsData.filter(n => !n.read).length
    
    return {
      notifications: notificationsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      unreadCount,
      settings: {
        email: true,
        push: true,
        sms: false,
        leadAlerts: true,
        financingAlerts: true,
        rentalAlerts: true,
        inventoryAlerts: true,
        systemUpdates: true
      }
    }
  },

  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false
    }
    notificationsData.unshift(newNotification)
    return newNotification
  },

  async getNotificationsByType(type: Notification['type']): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return notificationsData.filter(n => n.type === type).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  async getNotificationsByEntity(entityType: Notification['entityType'], entityId: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return notificationsData.filter(n => n.entityType === entityType && n.entityId === entityId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  // Toast notifications (client-side only)
  showToast(toast: Omit<ToastNotification, 'id'>): string {
    const id = `toast_${Date.now()}`
    const toastNotification: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }
    
    // This would typically be handled by a toast notification system
    // For now, we'll just return the ID
    console.log('Toast notification:', toastNotification)
    return id
  },

  async getNotificationStats(): Promise<{
    total: number
    unread: number
    byType: { [key in Notification['type']]: number }
  }> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const byType: { [key in Notification['type']]: number } = {
      success: 0,
      error: 0,
      warning: 0,
      info: 0
    }
    
    notificationsData.forEach(n => {
      byType[n.type]++
    })

    return {
      total: notificationsData.length,
      unread: notificationsData.filter(n => !n.read).length,
      byType
    }
  }
}
