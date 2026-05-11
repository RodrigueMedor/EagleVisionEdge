import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface AppContextType {
  // Global app state
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // User preferences
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Error handling
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
  
  // Success messages
  success: string | null
  setSuccess: (success: string | null) => void
  clearSuccess: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearSuccess = useCallback(() => {
    setSuccess(null)
  }, [])

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(clearSuccess, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, clearSuccess])

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setLoading,
        sidebarOpen,
        setSidebarOpen,
        theme,
        setTheme,
        error,
        setError,
        clearError,
        success,
        setSuccess,
        clearSuccess
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
