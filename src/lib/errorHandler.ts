import { addNotification } from '@/store/slices/notificationsSlice'
import { store } from '@/store'

let notificationId = 0

export function showNotification(
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  duration: number = 4000
) {
  store.dispatch(
    addNotification({
      id: `notif-${++notificationId}`,
      type,
      message,
      duration,
    })
  )
}

export function showError(error: unknown, fallbackMessage: string = 'Something went wrong') {
  const message =
    error instanceof Error ? error.message :
    typeof error === 'string' ? error :
    fallbackMessage

  showNotification('error', message)

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', error)
  }
}

export function showSuccess(message: string) {
  showNotification('success', message)
}

export function showInfo(message: string) {
  showNotification('info', message)
}

export function showWarning(message: string) {
  showNotification('warning', message)
}
