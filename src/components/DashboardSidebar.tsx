import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, TrendingUp, Settings, LogOut,
  Menu, X, Truck, Bot, Car, ChevronDown, FileText,
} from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { useAuth } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

const menuGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Inventory', icon: Package, href: '/dashboard/inventory' },
      { label: 'Leads', icon: Users, href: '/dashboard/leads' },
      { label: 'Customers', icon: Users, href: '/dashboard/customers' },
      { label: 'Rentals', icon: Truck, href: '/dashboard/rentals' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { label: 'CRM', icon: Bot, href: '/dashboard/crm' },
      { label: 'Virtual Showroom', icon: Car, href: '/dashboard/virtual-showroom' },
      { label: 'Predictive Maintenance', icon: Truck, href: '/dashboard/predictive-maintenance' },
      { label: 'AI Assistant', icon: Bot, href: '/dashboard/ai' },
      { label: 'Analytics', icon: TrendingUp, href: '/dashboard/analytics' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
      { label: 'Content', icon: FileText, href: '/dashboard/content' },
    ],
  },
]

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Main': true,
    'Advanced': true,
    'System': true,
  })
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-primary text-white p-3 rounded-2xl shadow-xl"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed md:sticky md:top-0 left-0 h-screen w-64 bg-primary text-white transform transition-all duration-300 z-40 md:z-10 md:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold/20 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Eagle Vision</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Dashboard</p>
            </div>
          </Link>
        </div>

        {user && (
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-gold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize truncate">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors mb-1"
              >
                {group.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    expandedGroups[group.label] ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedGroups[group.label] && (
                <div className="space-y-0.5 mb-3">
                  {group.items.map(item => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                        isActive(item.href)
                          ? 'bg-gold/15 text-gold font-medium'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      {isActive(item.href) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <ThemeSwitcher />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
