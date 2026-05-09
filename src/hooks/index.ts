import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addNotification, removeNotification } from '@/store/slices/notificationsSlice'

export const useNotification = () => {
  const dispatch = useAppDispatch()

  const notify = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) => {
    const id = `${Date.now()}-${Math.random()}`
    dispatch(addNotification({ id, message, type, duration }))

    if (duration > 0) {
      setTimeout(() => {
        dispatch(removeNotification(id))
      }, duration)
    }

    return id
  }

  const success = (message: string, duration?: number) => notify(message, 'success', duration)
  const error = (message: string, duration?: number) => notify(message, 'error', duration)
  const warning = (message: string, duration?: number) => notify(message, 'warning', duration)
  const info = (message: string, duration?: number) => notify(message, 'info', duration)

  return { notify, success, error, warning, info }
}

export const useAuth = () => {
  const auth = useAppSelector(state => state.auth)
  return auth
}

export const useUI = () => {
  const ui = useAppSelector(state => state.ui)
  return ui
}


