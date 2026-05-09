import { Outlet } from 'react-router-dom'
import DashboardSidebar from '@/components/DashboardSidebar'
import Toast from '@/components/Toast'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1">
        <div className="md:p-8 p-4">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  )
}

