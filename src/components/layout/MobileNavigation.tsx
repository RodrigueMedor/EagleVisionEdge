import { useState } from 'react'
import { Menu, X, Home, Car, Users, TrendingUp, Calendar, CreditCard, Settings, ChevronDown } from 'lucide-react'

interface MobileNavigationProps {
  currentPath?: string
}

export function MobileNavigation({ currentPath = '/dashboard' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Car },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    { name: 'Rentals', href: '/dashboard/rentals', icon: Calendar },
    { name: 'Financing', href: '/dashboard/financing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return currentPath === href || currentPath.startsWith('/dashboard/') && !navigation.slice(1).some(item => currentPath.startsWith(item.href))
    }
    return currentPath.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="relative flex flex-col w-80 max-w-full bg-white h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                Eagle Vision Edge v1.0.0
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 gap-1">
          {navigation.slice(0, 4).map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="truncate max-w-full">{item.name}</span>
            </a>
          ))}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 text-xs text-gray-600 hover:text-gray-900"
          >
            <ChevronDown className="w-5 h-5 mb-1" />
            <span>More</span>
          </button>
        </div>
      </div>
    </>
  )
}
