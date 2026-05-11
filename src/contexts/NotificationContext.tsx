import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Notification, ToastNotification } from '@/types/notifications'
import { notificationService } from '@/services/notificationService'

interface NotificationContextType {
  notifications: Notification[]
  toasts: ToastNotification[]
  isLoading: boolean
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void
  showToast: (toast: Omit<ToastNotification, 'id'>) => void
  removeToast: (id: string) => void
  refreshNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
      const newNotification = await notificationService.createNotification(notification)
      setNotifications(prev => [newNotification, ...prev])
    } catch (error) {
      console.error('Failed to add notification:', error)
    }
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }, [])

  const clearAllNotifications = useCallback(async () => {
    try {
      await notificationService.clearAllNotifications()
      setNotifications([])
    } catch (error) {
      console.error('Failed to clear all notifications:', error)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const newToast: ToastNotification = {
      ...toast,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setToasts(prev => [...prev, newToast])

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(newToast.id)
    }, toast.duration || 5000)
  }, [removeToast])

  // Load notifications on mount
  useEffect(() => {
    refreshNotifications()
  }, [refreshNotifications])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        isLoading,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        showToast,
        removeToast,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
