import React from 'react';
import { vehicles } from '../data/vehicles';
import VehicleCard from '../components/VehicleCard';
import CTA from '../components/CTA';
import { FaCar, FaShieldAlt, FaDollarSign, FaClock, FaStar, FaArrowRight, FaPhone, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';

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
              <span className="text-sm font-medium">Enterprise Dealership Platform</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block">Stop Losing</span>
                <span className="block text-gold">Customers</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                AI-Powered dealership operations platform that captures more leads, automates workflows, and increases dealership profit through intelligent CRM and inventory management.
              </p>
            </div>
            
            {/* B2B CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
                <FaCalendar />
                Schedule Demo
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
                <FaPhone />
                Talk to Sales
              </button>
            </div>
            
            {/* Subtle Dealer Access Link */}
            <div className="mt-6">
              <a 
                href="/dealer-login" 
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors group"
              >
                <FaCar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="border-b border-white/30 hover:border-white transition-colors">
                  Dealer Portal Access
                </span>
              </a>
            </div>
            
            {/* B2B Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">40%</div>
                <div className="text-sm text-gray-300 mt-1">More Leads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">60%</div>
                <div className="text-sm text-gray-300 mt-1">Faster Sales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">25%</div>
                <div className="text-sm text-gray-300 mt-1">Higher Profit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold">24/7</div>
                <div className="text-sm text-gray-300 mt-1">AI Automation</div>
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

      {/* Platform Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaStar />
              <span className="text-sm font-semibold">Dealership Operations Platform</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Complete Dealership Management</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern, profitable dealership operation in one integrated platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <FaCar className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">AI Lead Capture</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent lead qualification and automated follow-up that converts 40% more prospects into customers.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <FaDollarSign className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Digital Financing</h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined credit applications and automated underwriting that reduces approval time by 60%.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <FaClock className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Inventory Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time inventory tracking with AI-powered pricing optimization to maximize profit per vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
              <FaStar />
              <span className="text-sm font-semibold">Enterprise Dashboard</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">See Your Business at a Glance</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time analytics and insights that help you make data-driven decisions to grow your dealership.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Dealership Operations Dashboard</h3>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live Data</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-600 font-semibold">Total Leads</span>
                    <span className="text-green-500 text-sm">+12%</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">847</div>
                  <div className="text-blue-600 text-sm mt-1">This month</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 font-semibold">Sales</span>
                    <span className="text-green-500 text-sm">+8%</span>
                  </div>
                  <div className="text-3xl font-bold text-green-900">124</div>
                  <div className="text-green-600 text-sm mt-1">This month</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-600 font-semibold">Revenue</span>
                    <span className="text-green-500 text-sm">+15%</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-900">$2.4M</div>
                  <div className="text-purple-600 text-sm mt-1">This month</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-600 font-semibold">Conversion</span>
                    <span className="text-green-500 text-sm">+5%</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-900">14.6%</div>
                  <div className="text-orange-600 text-sm mt-1">Average rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Lead Pipeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">New Leads</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">634</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Contacted</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">412</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Qualified</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">287</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Closed</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '20%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">124</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Team Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sales Team</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Finance Team</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rental Team</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Service Team</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '88%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">88%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaShieldAlt />
              <span className="text-sm font-semibold">Trusted by Dealerships</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Join 500+ Successful Dealerships</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leading dealerships across the country trust Eagle Vision Edge to power their operations and growth.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Active Dealerships</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$2.5B</div>
              <div className="text-gray-600">Annual Sales Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-600">Vehicles Sold Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-gray-600">Platform Uptime</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Dealership?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              See how Eagle Vision Edge can help you capture more leads, streamline operations, and increase profitability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <FaCalendar />
                Schedule Your Demo
              </button>
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                <FaPhone />
                Talk to Sales Team
              </button>
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
