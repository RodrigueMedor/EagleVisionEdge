import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeNotification, Notification } from '@/store/slices/notificationsSlice'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export default function Toast() {
  const notifications = useAppSelector(state => state.notifications.items)
  const dispatch = useAppDispatch()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map(notification => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onClose={() => dispatch(removeNotification(notification.id))}
        />
      ))}
    </div>
  )
}

function ToastItem({
  notification,
  onClose,
}: {
  notification: Notification
  onClose: () => void
}) {
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(onClose, notification.duration)
      return () => clearTimeout(timer)
    }
  }, [notification.duration, onClose])

  const icons: Record<Notification['type'], JSX.Element> = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }

  const backgrounds: Record<Notification['type'], string> = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={`${backgrounds[notification.type]} border rounded-lg p-4 flex items-start gap-3 animate-slideUp`}
    >
      {icons[notification.type]}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-smooth"
      >
        <X size={18} />
      </button>
    </div>
  )
}


