import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Car, Menu, X, LogOut, Calendar, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { contentService } from '@/services/contentService'
import Button from '@/components/ui/Button'
import ScheduleDemo from './ScheduleDemo'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScheduleDemo, setShowScheduleDemo] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [siteName, setSiteName] = useState('Eagle Vision Edge')
  const [siteSubtitle, setSiteSubtitle] = useState('Dealership Operations Platform')
  const [sitePhone, setSitePhone] = useState('')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    contentService.getContent().then(c => {
      setSiteName(c.global.dealershipName)
      setSiteSubtitle(c.global.dealershipSubtitle)
      setSitePhone(c.global.phone)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (href: string) => location.pathname === href

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const publicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Inventory', href: '/inventory' },
    { label: 'Financing', href: '/financing' },
    { label: 'Rentals', href: '/rentals' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-soft border-b border-gray-100/50'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary via-secondary to-primary rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary group-hover:text-accent transition-colors duration-200">
                {siteName}
              </h1>
              <p className="text-[11px] text-gray-500 leading-tight">{siteSubtitle}</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                  isActive(link.href)
                    ? 'text-accent bg-accent/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hidden sm:block">
                  <Button size="sm" variant="secondary" className="rounded-xl">
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-accent transition-colors p-2 rounded-xl hover:bg-gray-50"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowScheduleDemo(true)}
                  className="hidden sm:inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-[0.97]"
                >
                  <Calendar size={16} />
                  Schedule Demo
                </button>

                <a href={`tel:${sitePhone.replace(/\D/g, '')}`} className="sm:hidden inline-flex items-center justify-center w-9 h-9 bg-primary hover:bg-secondary text-white rounded-xl transition-colors">
                  <Phone size={16} />
                </a>
              </>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-slideDown">
          <div className="px-4 py-3 space-y-1">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-accent/5 text-accent'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {!isAuthenticated && (
            <div className="px-4 py-3 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setShowScheduleDemo(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
              >
                <Calendar size={16} />
                Schedule Demo
              </button>
              <a href={`tel:${sitePhone.replace(/\D/g, '')}`} className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold transition-all">
                <Phone size={16} />
                {sitePhone}
              </a>
            </div>
          )}
        </div>
      )}

      <ScheduleDemo isOpen={showScheduleDemo} onClose={() => setShowScheduleDemo(false)} />
    </nav>
  )
}
