import { Link, useNavigate } from 'react-router-dom'
import { Car, Menu, X, LogOut, Building2, Calendar, Phone } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import Button from '@/components/ui/Button'
import ScheduleDemo from './ScheduleDemo'
import DealerPortal from './DealerPortal'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScheduleDemo, setShowScheduleDemo] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const publicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Inventory', href: '/inventory' },
    { label: 'Financing', href: '/financing' },
    { label: 'Rentals', href: '/rentals' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary group-hover:text-secondary transition-smooth">
                Eagle Vision Edge
              </h1>
              <p className="text-xs text-gray-500">Dealership Operations Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-700 hover:text-accent font-medium transition-smooth relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hidden sm:block">
                  <Button size="sm" variant="secondary">
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-accent transition-smooth flex items-center gap-1"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Schedule Demo - Primary CTA */}
                <button 
                  onClick={() => setShowScheduleDemo(true)}
                  className="hidden sm:flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105"
                >
                  <Calendar size={16} />
                  Schedule Demo
                </button>
                
                {/* Mobile: Phone CTA */}
                <button className="sm:hidden flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3 py-2 rounded-full text-xs font-semibold">
                  <Phone size={14} />
                  (407) 201-3109
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-primary hover:text-accent transition-smooth"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 animate-slideDown">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-smooth"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setShowScheduleDemo(false)
                }}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="px-4 py-2 space-y-2">
                <button 
                  onClick={() => setShowScheduleDemo(true)}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-3 rounded-full text-sm font-semibold transition-all"
                >
                  <Calendar size={16} />
                  Schedule Demo
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-full text-sm font-semibold transition-all">
                  <Phone size={16} />
                  (407) 201-3109
                </button>
              </div>
            )}
          </div>
        )}
      </div>
        
        {/* Modals */}
        <ScheduleDemo 
          isOpen={showScheduleDemo} 
          onClose={() => setShowScheduleDemo(false)} 
        />
    </nav>
  )
}

