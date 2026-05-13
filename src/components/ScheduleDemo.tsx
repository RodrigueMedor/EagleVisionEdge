import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, ArrowRight, X } from 'lucide-react';

interface ScheduleDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleDemo({ isOpen, onClose }: ScheduleDemoProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dealership: '',
    role: '',
    preferredTime: '',
    message: ''
  });

  const timeSlots = [
    '9:00 AM EST', '10:00 AM EST', '11:00 AM EST', '2:00 PM EST', '3:00 PM EST', '4:00 PM EST'
  ];

  const roles = [
    'Dealership Owner',
    'General Manager',
    'Sales Manager',
    'Finance Manager',
    'Rental Manager',
    'Marketing Director',
    'Other'
  ];

  const benefits = [
    'Live platform walkthrough',
    'Custom implementation plan',
    'ROI analysis for your dealership',
    'Q&A with dealership technology expert',
    'Special demo pricing options'
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Demo request submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Schedule Your Demo</h2>
                    <p className="text-sm text-gray-600">See how Eagle Vision Edge transforms dealership operations</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="john@dealership.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dealership Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dealership}
                    onChange={(e) => setFormData({...formData, dealership: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Sunshine Auto Group"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Select your role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Select preferred time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What challenges are you looking to solve?
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Tell us about your current dealership operations..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule My Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right side - Benefits */}
            <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary/95 p-8 lg:p-12 text-white">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">30-Minute Personalized Demo</span>
                </div>
                
                <h3 className="text-3xl font-bold mb-4">
                  Transform Your Dealership Operations
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  See how dealerships like yours are increasing leads by 40% and reducing sales cycle time by 60%.
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="font-semibold text-xl mb-4">What You'll Learn:</h4>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Quick Setup</h4>
                    <p className="text-white/80 text-sm">Get started in under 30 days</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Most dealerships see ROI within the first 90 days. Our onboarding team handles everything from data migration to staff training.
                </p>
              </div>

              <div className="mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-semibold mb-3">Demo Topics We'll Cover:</h4>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li>• Lead capture & AI qualification</li>
                    <li>• Inventory management & pricing</li>
                    <li>• Digital financing workflows</li>
                    <li>• Rental operations automation</li>
                    <li>• Analytics & reporting dashboard</li>
                    <li>• Team collaboration tools</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-white/70 text-sm mb-4">
                  Join 500+ dealerships using Eagle Vision Edge
                </p>
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-green-400 rounded-full"></div>
                  ))}
                </div>
                <p className="text-white/70 text-xs mt-2">4.9/5 Platform Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
