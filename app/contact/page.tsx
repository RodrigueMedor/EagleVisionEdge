'use client';

import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaQuestionCircle, FaHeadset } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactMethods = [
    {
      icon: FaPhone,
      title: 'Phone',
      value: '(407) 201-3109',
      description: 'Call us for immediate assistance',
      action: 'tel:+13055550199'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'hello@igrauto.com',
      description: 'Send us a message anytime',
      action: 'mailto:hello@igrauto.com'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      value: '2598 N Orange Blossom Trail, Kissimmee, FL 34744',
      description: 'Come see our showroom',
      action: '#location'
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  const faqs = [
    {
      question: 'What are your business hours?',
      answer: 'We\'re open Monday through Friday from 9 AM to 7 PM, and Saturday from 9 AM to 5 PM. We\'re closed on Sundays.'
    },
    {
      question: 'Do I need an appointment to visit?',
      answer: 'Appointments are recommended but not required. You can walk in during business hours, but appointments ensure dedicated service.'
    },
    {
      question: 'How quickly will you respond to my inquiry?',
      answer: 'We typically respond to emails within 24 hours and phone calls during business hours. For urgent matters, please call us directly.'
    },
    {
      question: 'Do you offer financing on-site?',
      answer: 'Yes! We have financing specialists available to help you explore your options and get pre-qualified on the spot.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'email'
    });
    
    setTimeout(() => {
      setSubmitStatus('idle');
      setIsSubmitting(false);
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
              <FaHeadset className="text-gold" />
              <span className="text-sm font-medium">Get in Touch</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="block">We're Here to</span>
                <span className="block text-gold">Help You</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Have questions about our vehicles, financing, or services? 
                Our team is ready to assist you every step of the way.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
                <FaPhone />
                Call Now
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
                <FaEnvelope />
                Email Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaPhone />
              <span className="text-sm font-semibold">Contact Methods</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Reach Out Anytime</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center group">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                  <method.icon className="text-gold text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <a 
                  href={method.action}
                  className="text-accent font-semibold hover:text-red-700 transition-colors block"
                >
                  {method.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Send Us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-green-700 font-semibold">Message sent successfully!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="(407) 201-3109"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact</label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl transition-all font-semibold flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Location & Hours */}
            <div className="space-y-8">
              {/* Location */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-4">Visit Our Showroom</h2>
                  <p className="text-gray-600">
                    Come see our vehicles and meet our team in person.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <FaMapMarkerAlt className="text-gold text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Address</h3>
                        <p className="text-gray-200">2598 N Orange Blossom Trail</p>
                        <p className="text-gray-200">Kissimmee, FL 34744</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <FaPhone className="text-gold text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Phone</h3>
                        <p className="text-gray-200">(407) 201-3109</p>
                        <p className="text-gray-200 text-sm">Toll-free: 1-800-EAGLE-01</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <FaEnvelope className="text-gold text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-gray-200">hello@igrauto.com</p>
                        <p className="text-gray-200 text-sm">support@igrauto.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Business Hours */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">Business Hours</h3>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">Find Us</h3>
                <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FaMapMarkerAlt className="text-4xl mb-2 mx-auto" />
                    <p>Interactive Map</p>
                    <p className="text-sm">2598 N Orange Blossom Trail, Kissimmee, FL 34744</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaQuestionCircle />
              <span className="text-sm font-semibold">Frequently Asked Questions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Common Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to our most frequently asked questions
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

