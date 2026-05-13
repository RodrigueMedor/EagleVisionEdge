import { Outlet } from 'react-router-dom'
import DashboardSidebar from '@/components/DashboardSidebar'
import Toast from '@/components/Toast'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-full">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  )
}

