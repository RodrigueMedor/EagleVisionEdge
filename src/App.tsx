import { Provider } from 'react-redux'
import { store } from '@/store'
import Routes from '@/routes'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { restoreAuth } from '@/store/slices/authSlice'
import AIChatWidget from '@/components/ai/AIChatWidget'

function AppContent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Restore auth state from localStorage on app load
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        dispatch(restoreAuth({ user, token }))
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [dispatch])

  return (
    <>
      <Routes />
      <AIChatWidget />
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App


