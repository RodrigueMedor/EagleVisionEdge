'use client';

import React, { useState } from 'react';
import { FaCar, FaTruck, FaUsers, FaShieldAlt, FaDollarSign, FaCheckCircle, FaStar, FaPhone, FaRoad, FaGasPump, FaTools, FaHeadset, FaCalendarAlt, FaQuestionCircle } from 'react-icons/fa';
import RentalModal from '../../components/RentalModal';

export default function RentalsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: '',
    message: ''
  });

  const rentalPlans = [
    {
      id: 'economy',
      name: 'Economy Driver',
      price: 349,
      period: 'week',
      popular: true,
      features: [
        'Fuel-efficient sedan',
        'Unlimited miles',
        'Basic insurance included',
        '24/7 roadside assistance',
        'Weekly maintenance',
        'Driver app integration'
      ],
      vehicleTypes: ['Toyota Camry', 'Honda Civic', 'Nissan Sentra'],
      icon: FaCar,
      color: 'bg-blue-500',
      bestFor: 'Uber/Lyft drivers',
      image: '/images/vehicles/camry-1.jpg',
      specs: {
        mpg: '32 City / 42 Highway',
        seats: '5 Passengers',
        transmission: 'Automatic',
        fuel: 'Gasoline'
      }
    },
    {
      id: 'premium',
      name: 'Premium Driver',
      price: 449,
      period: 'week',
      popular: false,
      features: [
        'Mid-size sedan or SUV',
        'Unlimited miles',
        'Enhanced insurance coverage',
        '24/7 roadside assistance',
        'Premium maintenance',
        'Driver app integration',
        'GPS navigation system'
      ],
      vehicleTypes: ['Toyota RAV4', 'Honda CR-V', 'Mazda CX-5'],
      icon: FaCar,
      color: 'bg-purple-500',
      bestFor: 'Premium rideshare',
      image: '/images/vehicles/rav4-1.jpg',
      specs: {
        mpg: '27 City / 35 Highway',
        seats: '7 Passengers',
        transmission: 'Automatic',
        fuel: 'Gasoline'
      }
    },
    {
      id: 'cargo',
      name: 'Cargo Van',
      price: 599,
      period: 'week',
      popular: false,
      features: [
        'Commercial cargo van',
        'Unlimited miles',
        'Commercial insurance',
        '24/7 roadside assistance',
        'Heavy-duty maintenance',
        'Cargo tracking system',
        'Loading equipment included'
      ],
      vehicleTypes: ['Ford Transit', 'Mercedes Sprinter', 'Ram ProMaster'],
      icon: FaTruck,
      color: 'bg-green-500',
      bestFor: 'Delivery services',
      image: '/images/vehicles/silverado-1.jpg',
      specs: {
        cargo: '300 cubic feet',
        payload: '3,500 lbs',
        transmission: 'Automatic',
        fuel: 'Diesel'
      }
    },
    {
      id: 'luxury',
      name: 'Luxury Experience',
      price: 799,
      period: 'week',
      popular: false,
      features: [
        'Premium luxury vehicle',
        'Unlimited miles',
        'Comprehensive insurance',
        '24/7 concierge service',
        'Premium detailing',
        'Advanced safety features',
        'Chauffeur support available'
      ],
      vehicleTypes: ['BMW 5 Series', 'Mercedes E-Class', 'Lexus ES'],
      icon: FaCar,
      color: 'bg-gold',
      bestFor: 'Special occasions',
      image: '/images/vehicles/c300-1.jpg',
      specs: {
        mpg: '26 City / 34 Highway',
        seats: '5 Passengers',
        transmission: 'Automatic',
        fuel: 'Gasoline'
      }
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      type: 'Uber Driver',
      content: 'The Economy Driver plan is perfect for my Uber business. Great vehicles, flexible terms, and excellent support.',
      rating: 5,
      weeks: 52
    },
    {
      name: 'James Chen',
      type: 'Delivery Business',
      content: 'Cargo Van rental helped me expand my delivery fleet without the upfront investment. Reliable vehicles and great service.',
      rating: 5,
      weeks: 24
    },
    {
      name: 'Sarah Thompson',
      type: 'Lyft Driver',
      content: 'Upgraded to Premium Driver and my earnings increased. Customers love the vehicles and the insurance coverage is comprehensive.',
      rating: 5,
      weeks: 36
    }
  ];

  const faqs = [
    {
      question: 'What are the requirements to rent a vehicle?',
      answer: 'You must be 21+ years old, have a valid driver\'s license, clean driving record, and pass a background check. Commercial rentals may require additional documentation.'
    },
    {
      question: 'Is insurance included in the rental price?',
      answer: 'Basic insurance is included with Economy and Premium plans. Commercial insurance is included with Cargo Van rentals. Additional coverage options are available.'
    },
    {
      question: 'Can I rent for less than a week?',
      answer: 'Our standard rental periods are weekly, but we offer flexible options for longer commitments. Contact us for custom rental periods.'
    },
    {
      question: 'What happens if the vehicle needs maintenance?',
      answer: 'All vehicles include regular maintenance. If issues arise, we provide 24/7 roadside assistance and replacement vehicles when needed.'
    },
    {
      question: 'Are there mileage restrictions?',
      answer: 'All our rental plans include unlimited miles, perfect for rideshare and delivery drivers.'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Rental application submitted! We\'ll contact you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', plan: '', message: '' });
  };

  return (
    <main className="space-y-0">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary/95 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <FaCar className="text-gold" />
              <span className="text-sm font-medium">Professional Vehicle Rentals</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="block">Drive Your Business</span>
                <span className="block text-gold">Forward</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Flexible weekly vehicle rentals for rideshare drivers, delivery services, and business needs. 
                No long-term commitments, just quality vehicles when you need them.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
                <FaCalendarAlt />
                Apply Now
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
                <FaPhone />
                (407) 201-3109
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaDollarSign />
              <span className="text-sm font-semibold">Rental Plans</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Choose Your Perfect Plan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible weekly rentals designed for drivers and businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rentalPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  plan.popular ? 'ring-2 ring-accent transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="relative">
                  {/* Vehicle Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-2xl">
                    <img
                      src={plan.image}
                      alt={`${plan.name} vehicle`}
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {plan.popular && (
                      <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="text-lg font-bold text-primary">${plan.price}</div>
                      <div className="text-xs text-gray-600">per {plan.period}</div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center`}>
                        <plan.icon className="text-white text-xl" />
                      </div>
                      <div className="text-right">
                        <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.bestFor}</p>
                      </div>
                    </div>
                    
                    {/* Vehicle Specs */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-primary mb-2 text-sm">Vehicle Specifications</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {plan.specs.mpg && (
                          <div className="flex items-center gap-1">
                            <FaGasPump className="text-accent" />
                            <span className="text-gray-700">{plan.specs.mpg} MPG</span>
                          </div>
                        )}
                        {plan.specs.seats && (
                          <div className="flex items-center gap-1">
                            <FaUsers className="text-accent" />
                            <span className="text-gray-700">{plan.specs.seats}</span>
                          </div>
                        )}
                        {plan.specs.cargo && (
                          <div className="flex items-center gap-1">
                            <FaTruck className="text-accent" />
                            <span className="text-gray-700">{plan.specs.cargo}</span>
                          </div>
                        )}
                        {plan.specs.payload && (
                          <div className="flex items-center gap-1">
                            <FaTruck className="text-accent" />
                            <span className="text-gray-700">{plan.specs.payload}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FaCar className="text-accent" />
                          <span className="text-gray-700">{plan.specs.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaGasPump className="text-accent" />
                          <span className="text-gray-700">{plan.specs.fuel}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-primary mb-2 text-sm">What's Included</h4>
                      <div className="space-y-2">
                        {plan.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-sm" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 4 && (
                          <div className="text-xs text-gray-500 italic">
                            +{plan.features.length - 4} more features
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Vehicle Types */}
                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-500 mb-2">Available Models:</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {plan.vehicleTypes.map((type, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handlePlanSelect(plan.id)}
                        className="w-full py-3 rounded-xl font-semibold bg-accent hover:bg-red-700 text-white transition-all transform hover:scale-105"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
                <FaShieldAlt />
                <span className="text-sm font-semibold">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                The Complete Rental Solution
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaRoad className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Unlimited Miles</h3>
                    <p className="text-gray-600">Drive as much as you need with no mileage restrictions. Perfect for rideshare and delivery drivers.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaGasPump className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Fuel Included Options</h3>
                    <p className="text-gray-600">Select plans include fuel cards and reimbursement options to keep your business moving.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaTools className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Full Maintenance</h3>
                    <p className="text-gray-600">Regular maintenance, oil changes, and repairs included. Keep your focus on driving, not vehicle upkeep.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaHeadset className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">24/7 Support</h3>
                    <p className="text-gray-600">Round-the-clock roadside assistance and customer support to keep you on the road.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Driver Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-gold" />
                  <span>Valid driver's license (2+ years)</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-gold" />
                  <span>Clean driving record</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-gold" />
                  <span>Age 21+ (25+ for premium vehicles)</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-gold" />
                  <span>Background check clearance</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-gold" />
                  <span>Proof of insurance or purchase coverage</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-gold" />
                  <span>Valid payment method</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white/10 rounded-xl">
                <p className="text-sm mb-2">Ready to start driving?</p>
                <button className="w-full bg-gold hover:bg-yellow-600 text-primary font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaStar />
              <span className="text-sm font-semibold">Driver Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">What Our Drivers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real experiences from drivers who have grown their business with our rentals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-gold" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{testimonial.weeks} weeks</p>
                    <p className="text-xs text-gray-400">rented</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaQuestionCircle />
              <span className="text-sm font-semibold">Frequently Asked Questions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Got Questions?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our rental services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <FaCar className="text-gold" />
              <span className="text-sm font-medium">Start Driving Today</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Hit the Road?
              </h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Join thousands of drivers who trust IGR AUTO SALES for their vehicle rental needs.
                Quick approval, flexible terms, and quality vehicles.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
                <FaCalendarAlt />
                Apply Online
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
                <FaPhone />
                Call (407) 201-3109
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Modal */}
      <RentalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedPlan={selectedPlan}
        rentalPlans={rentalPlans}
      />
    </main>
  );
}

