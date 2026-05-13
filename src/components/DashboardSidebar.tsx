import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Truck,
  Bot,
  AlertTriangle,
  Car,
} from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { useAuth } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Inventory', icon: Package, href: '/dashboard/inventory' },
  { label: 'Leads', icon: Users, href: '/dashboard/leads' },
  { label: 'Customers', icon: Users, href: '/dashboard/customers' },
  { label: 'Rentals', icon: Truck, href: '/dashboard/rentals' },
  { label: 'CRM', icon: Bot, href: '/dashboard/crm' },
  { label: 'Virtual Showroom', icon: Car, href: '/dashboard/virtual-showroom' },
  { label: 'Predictive Maintenance', icon: AlertTriangle, href: '/dashboard/predictive-maintenance' },
  { label: 'AI Assistant', icon: Bot, href: '/dashboard/ai' },
  { label: 'Analytics', icon: TrendingUp, href: '/dashboard/analytics' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const handleLogout = () => {
    dispatch(logout())
    // Navigate to login page after logout
    navigate('/login')
  }

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-primary dark:bg-gray-800 text-white p-3 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky md:top-0 left-0 h-screen w-64 bg-primary dark:bg-gray-900 text-white transform transition-transform duration-300 z-40 md:z-10 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Brand */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-gold">Eagle Vision</h2>
            <p className="text-xs text-gray-300 mt-1">Dashboard</p>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-white/10">
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center mb-2">
                <span className="font-semibold text-gold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-300 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-smooth ${
                  isActive(item.href)
                    ? 'bg-gold/20 text-gold'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive(item.href) && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>

          {/* Theme Switcher & Logout */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <ThemeSwitcher />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-smooth"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

