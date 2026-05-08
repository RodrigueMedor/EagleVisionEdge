import React from 'react';
import { vehicles } from '../data/vehicles';
import VehicleCard from '../components/VehicleCard';
import CTA from '../components/CTA';
import { FaCar, FaShieldAlt, FaDollarSign, FaClock, FaStar, FaArrowRight, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function HomePage() {
  const featured = vehicles.slice(0, 3);
  return (
    <main className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/95"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <FaShieldAlt className="text-gold" />
              <span className="text-sm font-medium">Trusted Florida Dealership Since 2010</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block">Drive Your</span>
                <span className="block text-gold">Dream Car</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Experience excellence at IGR AUTO SALES. Premium vehicles, transparent pricing, and flexible financing options tailored for Florida drivers.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
                <FaCar />
                Browse Inventory
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
                <FaPhone />
                (407) 201-3109
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">500+</div>
                <div className="text-sm text-gray-300 mt-1">Vehicles Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">15+</div>
                <div className="text-sm text-gray-300 mt-1">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">4.9★</div>
                <div className="text-sm text-gray-300 mt-1">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">100%</div>
                <div className="text-sm text-gray-300 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Inventory Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaCar />
              <span className="text-sm font-semibold">Premium Selection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Featured Vehicles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked premium vehicles offering exceptional value and performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/inventory" 
              className="inline-flex items-center gap-3 bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
            >
              View Complete Inventory
              <FaArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaStar />
              <span className="text-sm font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">The IGR AUTO SALES Difference</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another dealership. We're your trusted partner in finding the perfect vehicle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <FaShieldAlt className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Quality Assurance</h3>
              <p className="text-gray-600 leading-relaxed">
                Every vehicle undergoes rigorous inspection and comes with comprehensive warranty coverage for your peace of mind.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <FaDollarSign className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Transparent Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                No hidden fees or surprises. Clear, upfront pricing with flexible financing options tailored to your budget.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <FaClock className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Quick Approval</h3>
              <p className="text-gray-600 leading-relaxed">
                Get pre-approved in minutes, not days. Our streamlined process gets you behind the wheel faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaStar />
              <span className="text-sm font-semibold">Customer Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real experiences from Florida drivers who found their perfect vehicles with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-gold" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Outstanding service from start to finish. They made the financing process so easy and I drove home in my dream Camry the same day!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-primary">James Davis</p>
                  <p className="text-sm text-gray-500">Toyota Camry 2021</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-gold" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Best dealership experience in Miami! Transparent pricing, no pressure, and they really took the time to find the perfect SUV for my family."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <p className="font-semibold text-primary">Maria Rodriguez</p>
                  <p className="text-sm text-gray-500">Chevrolet Equinox 2022</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-gold" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Their rental program is perfect for my Uber business. Great rates, well-maintained vehicles, and excellent customer support."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">RT</span>
                </div>
                <div>
                  <p className="font-semibold text-primary">Robert Thompson</p>
                  <p className="text-sm text-gray-500">Rental Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
                <FaCar />
                <span className="text-sm font-semibold">Our Services</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Complete Automotive Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                From sales to service, we offer comprehensive solutions to meet all your automotive needs.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaDollarSign className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Flexible Financing</h3>
                    <p className="text-gray-600">Custom loan programs with competitive rates for all credit types.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaCar className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Premium Rentals</h3>
                    <p className="text-gray-600">Weekly and monthly rentals with flexible terms for driveshare and commercial use.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Extended Warranty</h3>
                    <p className="text-gray-600">Comprehensive coverage options to protect your investment.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white">
              <CTA 
                title="Ready to Drive?" 
                subtitle="Get pre-approved in minutes and drive home in your dream car today." 
                cta="Apply Now" 
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
