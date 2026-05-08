'use client';

import React from 'react';
import { FaTimes, FaCar, FaTruck, FaCheckCircle, FaCalendarAlt, FaPhone, FaUser, FaEnvelope, FaGasPump, FaUsers } from 'react-icons/fa';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: any;
  rentalPlans: any[];
}

export default function RentalModal({ isOpen, onClose, selectedPlan, rentalPlans }: RentalModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    driverLicense: '',
    message: ''
  });

  const plan = rentalPlans.find(p => p.id === selectedPlan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Rental application submitted for ${plan?.name}! We'll contact you within 24 hours.`);
    setFormData({ name: '', email: '', phone: '', driverLicense: '', message: '' });
    onClose();
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center`}>
                  <plan.icon className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary">{plan.name}</h2>
                  <p className="text-gray-600">${plan.price}/week - {plan.bestFor}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Vehicle Image Display */}
            <div className="mb-6">
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-2xl">
                <img
                  src={plan.image}
                  alt={`${plan.name} vehicle`}
                  className="object-cover h-full w-full"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold text-primary">${plan.price}</div>
                  <div className="text-sm text-gray-600">per {plan.period}</div>
                </div>
              </div>
            </div>

            {/* Vehicle Specifications */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-primary mb-3">Vehicle Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {plan.specs.mpg && (
                  <div className="text-center">
                    <FaGasPump className="text-accent text-xl mx-auto mb-1" />
                    <div className="text-xs text-gray-500">Fuel Economy</div>
                    <div className="text-sm font-semibold text-gray-700">{plan.specs.mpg}</div>
                  </div>
                )}
                {plan.specs.seats && (
                  <div className="text-center">
                    <FaUsers className="text-accent text-xl mx-auto mb-1" />
                    <div className="text-xs text-gray-500">Seating</div>
                    <div className="text-sm font-semibold text-gray-700">{plan.specs.seats}</div>
                  </div>
                )}
                {plan.specs.cargo && (
                  <div className="text-center">
                    <FaTruck className="text-accent text-xl mx-auto mb-1" />
                    <div className="text-xs text-gray-500">Cargo Space</div>
                    <div className="text-sm font-semibold text-gray-700">{plan.specs.cargo}</div>
                  </div>
                )}
                {plan.specs.payload && (
                  <div className="text-center">
                    <FaTruck className="text-accent text-xl mx-auto mb-1" />
                    <div className="text-xs text-gray-500">Payload</div>
                    <div className="text-sm font-semibold text-gray-700">{plan.specs.payload}</div>
                  </div>
                )}
                <div className="text-center">
                  <FaCar className="text-accent text-xl mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Transmission</div>
                  <div className="text-sm font-semibold text-gray-700">{plan.specs.transmission}</div>
                </div>
                <div className="text-center">
                  <FaGasPump className="text-accent text-xl mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Fuel Type</div>
                  <div className="text-sm font-semibold text-gray-700">{plan.specs.fuel}</div>
                </div>
              </div>
            </div>

            {/* Plan Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-primary mb-3">What's Included:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {plan.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">Available Models: {plan.vehicleTypes.join(', ')}</p>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="(407) 201-3109"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCar className="inline mr-2" />
                    Driver's License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({...formData, driverLicense: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="A123456789012"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  rows={3}
                  placeholder="Tell us about your driving experience or any special requirements..."
                />
              </div>

              {/* Terms */}
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> By submitting this application, you agree to our terms and conditions. 
                  You must be 21+ years old with a valid driver's license and clean driving record. 
                  Background check and insurance verification required.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
