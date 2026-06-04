import React from 'react';
import { FaCar, FaShieldAlt, FaClock, FaAward, FaUsers, FaHandshake, FaMapMarkerAlt, FaPhone, FaCheckCircle, FaTrophy, FaHeart } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <main className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/95"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <FaAward className="text-gold" />
              <span className="text-sm font-medium">Our Story</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block">About</span>
                <span className="block text-gold">IGR AUTO SALES</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Building trust and delivering excellence in Florida's automotive market since 2010
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2">
                <FaHeart />
                <span className="text-sm font-semibold">Our Journey</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                More Than Just a Dealership
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2010 by automotive enthusiast Michael Rodriguez, IGR AUTO SALES began as a small lot with a simple mission: to provide Florida drivers with quality vehicles at fair prices, backed by honest service.
                </p>
                <p>
                  What started with just 15 vehicles has grown into one of South Florida's most trusted independent dealerships. Today, we're proud to have helped over 5,000 families find their perfect vehicles while building lasting relationships in our community.
                </p>
                <p>
                  Our name represents our philosophy: the <strong>Eagle</strong> symbolizes our vision and commitment to excellence, while <strong>Vision Edge</strong> represents our forward-thinking approach to automotive retail.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gold mb-2">2010</div>
                  <p className="text-xl">The Year It All Started</p>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gold">15+</div>
                    <p className="text-sm opacity-90">Years in Business</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold">5000+</div>
                    <p className="text-sm opacity-90">Happy Customers</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold">50+</div>
                    <p className="text-sm opacity-90">Vehicle Inventory</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold">4.9★</div>
                    <p className="text-sm opacity-90">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaShieldAlt />
              <span className="text-sm font-semibold">Our Core Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Integrity First</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in transparent pricing, honest communication, and doing what's right for our customers, even when it's not the easiest path.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <FaHeart className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Customer Care</h3>
              <p className="text-gray-600 leading-relaxed">
                Every customer becomes part of our family. We're committed to providing exceptional service that extends long after the sale.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <FaTrophy className="text-accent text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                From vehicle selection to customer service, we strive for excellence in every aspect of our business operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaUsers />
              <span className="text-sm font-semibold">Meet Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">The People Behind Your Success</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to helping you find the perfect vehicle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">MR</span>
                </div>
                <div className="absolute bottom-2 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">Michael Rodriguez</h3>
              <p className="text-accent font-semibold mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">15+ years in automotive industry</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">SC</span>
                </div>
                <div className="absolute bottom-2 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">Sarah Chen</h3>
              <p className="text-accent font-semibold mb-2">Sales Manager</p>
              <p className="text-gray-600 text-sm">Expert in customer satisfaction</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">JP</span>
                </div>
                <div className="absolute bottom-2 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">James Park</h3>
              <p className="text-accent font-semibold mb-2">Finance Director</p>
              <p className="text-gray-600 text-sm">Specialized in auto financing</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">LM</span>
                </div>
                <div className="absolute bottom-2 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">Lisa Martinez</h3>
              <p className="text-accent font-semibold mb-2">Service Manager</p>
              <p className="text-gray-600 text-sm">Vehicle inspection specialist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2">
                <FaMapMarkerAlt />
                <span className="text-sm font-semibold">Our Facility</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                State-of-the-Art Showroom
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">Modern Showroom</h3>
                    <p className="text-gray-600">10,000 sq ft climate-controlled facility showcasing 50+ premium vehicles</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">Service Center</h3>
                    <p className="text-gray-600">Full-service inspection and detailing bays for comprehensive vehicle preparation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">Customer Lounge</h3>
                    <p className="text-gray-600">Comfortable waiting area with refreshments and business facilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">Prime Location</h3>
                    <p className="text-gray-600">Conveniently located on Ocean Drive with easy access from major highways</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Visit Our Showroom</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-gold" />
                    <div>
                      <p className="font-semibold">2598 N Orange Blossom Trail</p>
                      <p className="text-sm text-gray-600 mt-1">Kissimmee, FL 34744</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-gold" />
                    <div>
                      <p className="font-semibold">Business Hours</p>
                      <p className="text-sm opacity-90">Mon-Fri: 9AM-7PM, Sat: 9AM-5PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-gold" />
                    <div>
                      <p className="font-semibold">(407) 201-3109</p>
                      <p className="text-sm opacity-90">Call for appointments</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm opacity-90 mb-4">Experience the IGR AUTO SALES difference in person</p>
                  <button className="w-full bg-gold hover:bg-yellow-600 text-primary font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105">
                    Schedule Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <FaHandshake className="text-gold" />
              <span className="text-sm font-medium">Join Our Family</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Experience the
                <span className="block text-gold">IGR AUTO SALES</span>
                <span className="block">Difference?</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Visit our showroom or browse our inventory online to see why thousands of Florida drivers trust us with their automotive needs.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
                <FaCar />
                Browse Inventory
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
                <FaPhone />
                Call Us Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
