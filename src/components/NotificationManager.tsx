import { useState } from 'react'
import { ToastContainer } from '@/components/ui/Toast'
import { NotificationCenter, NotificationButton } from '@/components/NotificationCenter'
import { useNotification } from '@/contexts/NotificationContext'

export function NotificationManager() {
  const { notifications, toasts, markAsRead, deleteNotification, markAllAsRead, clearAllNotifications } = useNotification()
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)

  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onClose={(id) => {
          // Toast removal is handled automatically by the context
        }}
      />

      {/* Notification Button */}
      <NotificationButton
        notifications={notifications}
        onToggle={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
      />

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAllNotifications}
      />
    </>
  )
}
