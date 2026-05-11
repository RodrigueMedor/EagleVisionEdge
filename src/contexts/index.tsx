import { ReactNode } from 'react'
import { AppProvider } from './AppContext'
import { DataProvider } from './DataContext'
import { NotificationProvider } from './NotificationContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <DataProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </DataProvider>
    </AppProvider>
  )
}

// Export all hooks for easy access
export { useApp } from './AppContext'
export { useData } from './DataContext'
export { useNotification } from './NotificationContext'
