import HeroSection from '@/components/ui/HeroSection'
import SectionHeader from '@/components/ui/SectionHeader'
import BenefitCard from '@/components/ui/BenefitCard'
import CTASection from '@/components/ui/CTASection'
import RentalCard from '@/components/rentals/RentalCard'
import RentalForm from '@/components/rentals/RentalForm'
import RentalReservationModal from '@/components/rentals/RentalReservationModal'
import Button from '@/components/ui/Button'
import { ToastContainer } from '@/components/ui/Toast'
import { useModal } from '@/hooks/useFinancing'
import { useToast } from '@/hooks/useFinancing'
import { useState } from 'react'
import { 
  Car, 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  Clock,
  Shield,
  TrendingUp
} from 'lucide-react'

export default function RentalsPage() {
  const reservationModal = useModal()
  const { toasts, removeToast, showInfo } = useToast()
  const [selectedVehicle, setSelectedVehicle] = useState<{
    name: string
    type: string
    price: string
    capacity?: string
    cargo?: string
  } | null>(null)
  const handleReserveVehicle = (vehicle: {
    name: string
    type: string
    price: string
    capacity?: string
    cargo?: string
  }) => {
    setSelectedVehicle(vehicle)
    reservationModal.openModal()
  }

  const rentalCategories = [
    {
      icon: Car,
      title: 'Uber Rentals',
      description: 'Perfect for rideshare drivers. Reliable vehicles with flexible weekly and monthly rates designed to maximize your earnings.',
      accent: true
    },
    {
      icon: Package,
      title: 'Cargo Van Rentals',
      description: 'Spacious cargo vans for business deliveries, moving, or commercial use. Various sizes available for your needs.',
      accent: false
    },
    {
      icon: Calendar,
      title: 'Daily Rentals',
      description: 'Short-term vehicle rentals for personal or business use. Competitive daily rates with flexible pickup and return times.',
      accent: false
    },
    {
      icon: Users,
      title: 'Commercial Fleet',
      description: 'Complete fleet solutions for businesses. Custom rental programs with dedicated support and maintenance services.',
      accent: true
    }
  ]

  const rentalBenefits = [
    {
      icon: DollarSign,
      title: 'Affordable Rates',
      description: 'Competitive pricing with no hidden fees. Special discounts for long-term rentals and commercial accounts.',
      accent: false
    },
    {
      icon: Clock,
      title: 'Flexible Rental Periods',
      description: 'Rent by the day, week, or month. Custom rental terms available for special requirements.',
      accent: true
    },
    {
      icon: Shield,
      title: 'Business Fleet Support',
      description: 'Dedicated account management, billing solutions, and priority service for business customers.',
      accent: false
    },
    {
      icon: TrendingUp,
      title: 'Ride-Share Ready',
      description: 'All vehicles meet rideshare platform requirements. Insurance packages and maintenance included.',
      accent: true
    }
  ]

  const featuredVehicles = [
    {
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop',
      name: 'Toyota Camry',
      type: 'Sedan - Perfect for Uber',
      price: '$35',
      capacity: '5 Passengers',
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&h=400&fit=crop',
      name: 'Ford Transit',
      type: 'Cargo Van - Business Ready',
      price: '$75',
      cargo: '250 cu ft',
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
      name: 'Chevrolet Malibu',
      type: 'Sedan - Daily Rental',
      price: '$45',
      capacity: '5 Passengers',
      available: false
    },
    {
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',
      name: 'Nissan Sentra',
      type: 'Compact - Economy',
      price: '$28',
      capacity: '5 Passengers',
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
      name: 'Ram ProMaster',
      type: 'Cargo Van - Large',
      price: '$95',
      cargo: '450 cu ft',
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
      name: 'Honda Accord',
      type: 'Sedan - Premium',
      price: '$55',
      capacity: '5 Passengers',
      available: true
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Hero Section */}
      <HeroSection
        title="Reliable Vehicle Rental Solutions"
        subtitle="Uber & Cargo Van Rentals Available"
        description="Professional vehicle rentals for personal, business, and rideshare needs. Flexible terms, competitive rates, and quality vehicles ready when you are."
        image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=800&fit=crop"
      >
        <Button 
          variant="secondary" 
          size="lg" 
          className="bg-white text-primary hover:bg-gray-100"
          onClick={() => {
            // Scroll to featured vehicles section and open first available reservation
            const featuredSection = document.getElementById('featured-vehicles')
            if (featuredSection) {
              featuredSection.scrollIntoView({ behavior: 'smooth' })
              // Find first available vehicle and open reservation
              setTimeout(() => {
                const availableVehicle = featuredVehicles.find(v => v.available)
                if (availableVehicle) {
                  handleReserveVehicle(availableVehicle)
                }
              }, 500)
            }
          }}
        >
          Reserve Vehicle
        </Button>
        <Button 
          variant="accent" 
          size="lg" 
          className="border-2 border-white"
          onClick={() => {
            window.open('tel:5551234567', '_self')
              showInfo('Call Us', 'Please call (555) 123-4567 to speak with our rental team.')
            }}
        >
          Contact Us
        </Button>
      </HeroSection>

      {/* Rental Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Rental Categories"
            description="Choose from our wide range of rental options designed to meet your specific needs."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rentalCategories.map((category, index) => (
              <BenefitCard
                key={index}
                icon={category.icon}
                title={category.title}
                description={category.description}
                accent={category.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rental Vehicles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Rental Vehicles"
            description="Browse our selection of well-maintained vehicles ready for your rental needs."
          />
          <div id="featured-vehicles" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle, index) => (
              <RentalCard
                key={index}
                image={vehicle.image}
                name={vehicle.name}
                type={vehicle.type}
                price={vehicle.price}
                capacity={vehicle.capacity}
                cargo={vehicle.cargo}
                available={vehicle.available}
                onReserve={handleReserveVehicle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Rental Inquiry Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Rental Inquiry Form"
            description="Ready to rent? Fill out our inquiry form and we'll contact you to confirm availability and complete your reservation."
          />
          <div className="bg-white rounded-xl shadow-lg p-8">
            <RentalForm />
          </div>
        </div>
      </section>

      {/* Rental Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Choose Our Rentals?"
            description="Experience the difference with our customer-focused rental services and quality vehicle fleet."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rentalBenefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                accent={benefit.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-gray-200">Vehicle Fleet</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-200">Roadside Assistance</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-200">Customer Satisfaction</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">5min</div>
              <div className="text-gray-200">Average Pickup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Reserve Your Vehicle?"
        description="Get on the road today with our quick and easy rental process. Quality vehicles, competitive rates, and exceptional service."
      >
        <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
          Reserve Now
        </Button>
        <Button variant="accent" size="lg" className="border-2 border-white">
          Call (555) 123-4567
        </Button>
      </CTASection>

      {/* Rental Reservation Modal */}
      <RentalReservationModal
        isOpen={reservationModal.isOpen}
        onClose={reservationModal.closeModal}
        vehicleName={selectedVehicle?.name}
        vehicleType={selectedVehicle?.type}
        dailyRate={selectedVehicle?.price}
      />
    </div>
  )
}
