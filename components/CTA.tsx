'use client';

import React, { useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaCar } from 'react-icons/fa';

export default function CTA({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert('Application submitted! We\'ll contact you within 24 hours.');
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
          <FaCar className="text-gold" />
          <span className="text-sm font-medium">Quick Application</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">{title}</h3>
        {subtitle && <p className="text-lg opacity-90 leading-relaxed">{subtitle}</p>}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-gold flex-shrink-0" />
          <span className="text-sm">Instant Pre-Approval</span>
        </div>
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-gold flex-shrink-0" />
          <span className="text-sm">No Credit Impact</span>
        </div>
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-gold flex-shrink-0" />
          <span className="text-sm">Rates From 2.9%</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-gold hover:bg-yellow-600 text-primary font-bold px-6 py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
        >
          {cta || 'Get Started'}
          <FaArrowRight />
        </button>
      </form>

      {/* Trust indicators */}
      <div className="text-center text-sm opacity-75">
        <p>Trusted by 10,000+ Florida drivers • Secure application • No obligation</p>
      </div>
    </div>
  );
}

