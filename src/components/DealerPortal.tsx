import React, { useState } from 'react';
import { Building2, Shield, Users, TrendingUp, Lock, ArrowRight, X, CheckCircle } from 'lucide-react';

interface DealerPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DealerPortal({ isOpen, onClose }: DealerPortalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const features = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Lead Management",
      description: "Capture, track, and convert more leads with AI-powered CRM"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Collaboration",
      description: "Coordinate sales, financing, and rental teams seamlessly"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure Operations",
      description: "Enterprise-grade security for dealership data and workflows"
    }
  ];

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
            {/* Left side - Login Form */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Dealer Portal</h2>
                    <p className="text-sm text-gray-600">Authorized Access Only</p>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="dealer@dealership.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:text-secondary font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Access Dashboard
                </button>
              </form>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900">Secure Dealer Access</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      This portal is restricted to authorized dealership personnel only. 
                      Unauthorized access is prohibited and monitored.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Features & Benefits */}
            <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary/95 p-8 lg:p-12 text-white">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Enterprise Platform</span>
                </div>
                
                <h3 className="text-3xl font-bold mb-4">
                  Manage Your Dealership Operations
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  The complete dealership management platform designed for modern automotive businesses.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-semibold mb-3">Platform Capabilities</h4>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Inventory Management & AI Pricing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Lead Capture & CRM Automation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Digital Financing & Credit Processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Rental Operations & Fleet Management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Analytics & Business Intelligence
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-white/70 mb-4">
                  Don't have dealer access? Request a consultation to get started.
                </p>
                <button className="w-full bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
