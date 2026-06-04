import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Car, ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { contentService } from '@/services/contentService'

const socialIcons: Record<string, React.ElementType> = { facebook: Facebook, twitter: Twitter, linkedin: Linkedin }

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [content, setContent] = useState({
    name: 'Eagle Vision Edge',
    subtitle: 'Dealership Operations Platform',
    description: '',
    phone: '(305) 555-0100',
    phoneRaw: '+13055550100',
    email: 'info@eaglevisionedge.com',
    location: 'Miami, Florida 33101',
    social: { facebook: '#', twitter: '#', linkedin: '#' } as unknown as { [key: string]: string },
  })

  useEffect(() => {
    contentService.getContent().then(c => {
      setContent({
        name: c.global.dealershipName,
        subtitle: c.global.dealershipSubtitle,
        description: c.global.footerDescription,
        phone: c.global.phone,
        phoneRaw: c.global.phoneRaw,
        email: c.global.email,
        location: `${c.global.address.city}, ${c.global.address.state} ${c.global.address.zip}`,
        social: c.global.socialMedia as unknown as { [key: string]: string },
      })
    })
  }, [])

  const socialLinks = Object.entries(content.social)
    .filter(([key]) => socialIcons[key])
    .map(([key, href]) => ({ icon: socialIcons[key], href }))

  const addressStr = `${content.location}`

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-16 lg:py-20">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{content.name}</h3>
                <p className="text-xs text-gray-400">{content.subtitle}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              {content.description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 hover:bg-gold/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-gold transition-all duration-200 hover:scale-110"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Inventory', href: '/inventory' },
                { label: 'Financing', href: '/financing' },
                { label: 'Rentals', href: '/rentals' },
                { label: 'Auctions', href: '/auctions' },
                { label: 'About Us', href: '/about' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Schedule Demo', href: '/schedule-demo' },
                { label: 'Dealer Access', href: '/dealer-login' },
                { label: 'Financing', href: '/financing' },
                { label: 'Rentals', href: '/rentals' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-gold" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Phone</p>
                  <a href={`tel:${content.phoneRaw}`} className="text-white text-sm hover:text-gold transition-colors">{content.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={14} className="text-gold" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <a href={`mailto:${content.email}`} className="text-white text-sm hover:text-gold transition-colors">{content.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-gold" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Location</p>
                  <p className="text-white text-sm">{addressStr}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {currentYear} {content.name}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/contact" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-gold transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
