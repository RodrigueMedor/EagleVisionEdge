import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Car, Shield, DollarSign, Clock, Star, ArrowRight, Mail, Phone, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { inventoryService } from '@/services/inventoryService'
import { contentService } from '@/services/contentService'
import { mockVehicles } from '@/data/mockVehicles'
import { Vehicle } from '@/types/vehicle'
import { SiteContent } from '@/types/content'

const iconMap: Record<string, React.ElementType> = { Shield, DollarSign, Clock, Star, Phone, Mail, Car, ArrowUpRight }

export default function HomePage() {
  const navigate = useNavigate()
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    loadFeaturedVehicles()
    contentService.getContent().then(setContent)
  }, [])

  const loadFeaturedVehicles = async () => {
    try {
      const vehicles = await inventoryService.getVehicles()
      const featured = vehicles.filter(v => v.status === 'available').slice(0, 6)
      setFeaturedVehicles(featured)
    } catch {
      const featured = mockVehicles.filter(v => v.status === 'available').slice(0, 6)
      setFeaturedVehicles(featured)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value)

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const home = content?.home
  const global = content?.global

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/50 to-primary/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/20" />
        </div>
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gold/15 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-200">{global ? `Premium Auto Dealership — ${global.address.city}, ${global.address.state}` : 'Premium Auto Dealership'}</span>
            </div>

            <h1 className="mb-6 animate-fade-in-up">
              <span className="block text-base sm:text-lg font-medium tracking-[0.2em] uppercase text-gray-300 mb-4 drop-shadow">
                {home ? home.hero.subtitle : 'Find Your'}
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.05] mb-2 drop-shadow-lg">
                {home ? home.hero.title.split(' ').slice(0, -1).join(' ') : 'Perfect'}{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-red-400 to-gold">
                  {home ? home.hero.title.split(' ').pop() : 'Vehicle'}
                </span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-1">
              {home ? home.hero.description : 'Quality vehicles, competitive prices, and exceptional service — your trusted dealership partner in South Florida.'}
            </p>

            <div className="max-w-2xl mx-auto animate-fade-in-up stagger-2">
              <div className="flex gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-1.5">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by make, model, or VIN..."
                    className="w-full bg-transparent text-white placeholder-gray-400 pl-10 pr-4 py-3 text-sm focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-accent hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.97] flex items-center gap-2"
                >
                  Search
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mt-14 animate-fade-in-up stagger-3">
              {(home ? home.stats : [
                { value: '500+', label: 'Vehicles in Stock' },
                { value: '4.8', label: 'Customer Rating', suffix: '★' },
                { value: '10+', label: 'Years in Business' },
              ]).slice(0, 3).map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    {stat.value}{stat.suffix || ''}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">Featured Inventory</span>
              <h2 className="heading-2 mt-2">{home ? home.featuredSectionTitle : 'Featured Vehicles'}</h2>
              <p className="text-gray-500 mt-2 max-w-xl">{home ? home.featuredSectionDescription : 'Handpicked selection of quality vehicles ready for test drive'}</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/inventory')} className="hidden sm:flex">
              View All Inventory
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="group overflow-hidden p-0 border-0 shadow-soft hover:shadow-xl rounded-2xl"
                >
                  <div className="h-52 bg-gray-100 relative overflow-hidden">
                    <ImageWithFallback
                      src={vehicle.images?.[0] || ''}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      Available
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-white text-lg font-bold drop-shadow-lg">
                        {formatCurrency(vehicle.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-primary text-lg mb-1 group-hover:text-accent transition-colors">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 mb-4">
                      <span>{vehicle.mileage.toLocaleString()} mi</span>
                      <span>•</span>
                      <span>{vehicle.fuelType}</span>
                      <span>•</span>
                      <span>{vehicle.transmission}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                        className="flex-1 bg-primary hover:bg-secondary text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/contact?vehicle=${vehicle.id}`)}
                        className="px-4 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-primary text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
                      >
                        Inquire
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12 sm:hidden">
            <Button variant="primary" size="lg" onClick={() => navigate('/inventory')}>
              View All Inventory
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
            <h2 className="heading-2 mt-2">{home ? home.whyUsTitle : 'Why Eagle Vision Edge'}</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              {home ? home.whyUsDescription : 'We are committed to providing the best car buying experience with transparency and quality'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {(home ? home.benefits : [
              { title: 'Quality Assurance', description: 'All vehicles undergo rigorous 150-point inspection' },
              { title: 'Competitive Pricing', description: 'Fair market prices with zero hidden fees' },
              { title: 'Quick Approval', description: 'Fast financing decisions' },
              { title: 'Expert Service', description: 'Knowledgeable staff dedicated to your satisfaction' },
            ]).map((benefit, i) => {
              const Icon = iconMap[benefit.title.includes('Assurance') ? 'Shield' : benefit.title.includes('Pricing') ? 'DollarSign' : benefit.title.includes('Approval') ? 'Clock' : 'Star'] || Star
              return (
                <div
                  key={benefit.title}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-primary text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              {home ? home.ctaTitle : 'Ready to Find Your Dream Car'}
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
              {home ? home.ctaDescription : 'Visit us today or schedule a test drive online — our team is ready to help you drive away happy'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200 hover:shadow-2xl hover:shadow-red-500/25 active:scale-[0.97]"
              >
                <Phone size={18} />
                Schedule Test Drive
              </button>
              <button
                onClick={() => navigate('/inventory')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200 active:scale-[0.97]"
              >
                Browse Inventory
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Phone, title: 'Call Us', info: global?.phone || '(305) 555-0100', sub: global?.businessHours?.weekday || 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM' },
              { icon: Mail, title: 'Email Us', info: global?.email || 'info@eaglevisionedge.com', sub: 'We respond within 24 hours' },
              { icon: Car, title: 'Visit Us', info: global?.address?.street || '123 Main Street', sub: global ? `${global.address.city}, ${global.address.state} ${global.address.zip}` : 'Miami, FL 33101' },
            ].map(({ icon: Icon, title, info, sub }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-primary text-lg mb-1">{title}</h3>
                <p className="text-gray-900 font-medium">{info}</p>
                <p className="text-sm text-gray-500 mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
