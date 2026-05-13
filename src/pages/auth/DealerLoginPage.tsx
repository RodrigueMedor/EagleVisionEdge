import React, { useState } from 'react';
import { Building2, Shield, Users, TrendingUp, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess, setLoading } from '@/store/slices/authSlice';
import { useNotification } from '@/hooks';

export default function DealerLoginPage() {
  const [email, setEmail] = useState('dealer@eaglevisionedge.com');
  const [password, setPassword] = useState('dealer123');
  const [error, setError] = useState('');
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { success, error: showError } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const response = await authService.login({ email, password });
      // Transform AuthResponse to match User type requirements
      const transformedResponse = {
        user: {
          ...response.user,
          permissions: {
            dashboard: 'full_access' as const,
            inventory: 'read' as const,
            crm: 'write' as const,
            leads: 'write' as const,
            financing: 'view_only' as const,
            rentals: 'view_only' as const,
            analytics: 'view_only' as const,
            ai_assistant: 'view_only' as const,
            notifications: 'full_access' as const,
            reports: 'view_only' as const,
            settings: 'view_only' as const,
            user_management: 'view_only' as const,
            permissions: 'view_only' as const
          },
          isActive: true,
          createdAt: new Date().toISOString()
        },
        token: response.token
      };
      dispatch(loginSuccess(transformedResponse));
      success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Login failed';
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex min-h-screen">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Eagle Vision Edge</h1>
                <p className="text-xs text-gray-500">Dealer Portal</p>
              </div>
            </Link>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">Dealer Access</h2>
                <p className="text-gray-600">Authorized dealership personnel only</p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:text-secondary font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Accessing...' : 'Access Dashboard'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm">Secure Dealer Access</h4>
                    <p className="text-amber-700 text-xs mt-1">
                      This portal is restricted to authorized dealership personnel only. 
                      Unauthorized access is prohibited and monitored.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Need dealership access?{' '}
                  <Link to="/schedule-demo" className="text-primary hover:text-secondary font-semibold">
                    Request Consultation
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features & Benefits */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-secondary/95 p-12 text-white">
          <div className="h-full flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Enterprise Platform</span>
              </div>
              
              <h3 className="text-4xl font-bold mb-4">
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

            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
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

            <div className="mt-8">
              <p className="text-white/70 text-sm mb-4">
                Don't have dealer access? Request a consultation to get started.
              </p>
              <Link 
                to="/schedule-demo"
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all"
              >
                Schedule Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
