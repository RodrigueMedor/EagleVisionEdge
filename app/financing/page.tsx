'use client';

import React, { useState } from 'react';
import { FaCar, FaDollarSign, FaClock, FaCheckCircle, FaCalculator, FaShieldAlt, FaPhone, FaFileAlt, FaChartLine, FaHandshake, FaStar, FaQuestionCircle } from 'react-icons/fa';

export default function FinancingPage() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(4.99);
  const [loanTerm, setLoanTerm] = useState(60);
  const [creditScore, setCreditScore] = useState(700);

  const calculateMonthlyPayment = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return monthlyPayment.toFixed(2);
  };

  const totalInterest = (parseFloat(calculateMonthlyPayment()) * loanTerm - (loanAmount - downPayment)).toFixed(2);
  const totalAmount = (parseFloat(calculateMonthlyPayment()) * loanTerm).toFixed(2);

  const loanOptions = [
    {
      name: 'Excellent Credit',
      creditScore: '750+',
      apr: '2.99%',
      downPayment: '10%',
      term: '36-72 months',
      features: ['Best rates', 'Flexible terms', 'No prepayment penalty'],
      color: 'bg-green-500',
      recommended: true
    },
    {
      name: 'Good Credit',
      creditScore: '680-749',
      apr: '4.99%',
      downPayment: '15%',
      term: '36-60 months',
      features: ['Competitive rates', 'Standard terms', 'Quick approval'],
      color: 'bg-blue-500',
      recommended: false
    },
    {
      name: 'Fair Credit',
      creditScore: '620-679',
      apr: '6.99%',
      downPayment: '20%',
      term: '36-48 months',
      features: ['Competitive rates', 'Build credit', 'Fixed terms'],
      color: 'bg-yellow-500',
      recommended: false
    },
    {
      name: 'Building Credit',
      creditScore: 'Below 620',
      apr: '8.99%',
      downPayment: '25%',
      term: '24-36 months',
      features: ['Credit building', 'Shorter terms', 'Refinance options'],
      color: 'bg-purple-500',
      recommended: false
    }
  ];

  const benefits = [
    {
      icon: FaShieldAlt,
      title: 'Competitive Rates',
      description: 'We work with multiple lenders to get you the best possible rates based on your credit profile.'
    },
    {
      icon: FaClock,
      title: 'Quick Approval',
      description: 'Get pre-qualified in minutes with our simple online application process.'
    },
    {
      icon: FaHandshake,
      title: 'Flexible Terms',
      description: 'Choose from 24 to 84 month loan terms to fit your budget and lifestyle.'
    },
    {
      icon: FaCheckCircle,
      title: 'No Hidden Fees',
      description: 'Transparent pricing with no application fees, prepayment penalties, or hidden charges.'
    }
  ];

  const faqs = [
    {
      question: 'What credit score do I need for financing?',
      answer: 'We work with all credit scores. Excellent credit (750+) gets the best rates, but we have options for fair and building credit profiles.'
    },
    {
      question: 'How much down payment is required?',
      answer: 'Down payments range from 10% to 25% depending on your credit profile and the vehicle price.'
    },
    {
      question: 'Can I pay off my loan early?',
      answer: 'Yes! All our loans have no prepayment penalties, so you can pay off your loan early without any extra fees.'
    },
    {
      question: 'What documents do I need?',
      answer: 'You\'ll need a valid driver\'s license, proof of income (pay stubs), proof of residence, and insurance.'
    },
    {
      question: 'How long does approval take?',
      answer: 'Pre-qualification takes just a few minutes. Full approval typically takes 24-48 hours once documents are submitted.'
    }
  ];

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
              <FaDollarSign className="text-gold" />
              <span className="text-sm font-medium">Flexible Financing Options</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="block">Drive Home</span>
                <span className="block text-gold">Today</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Competitive rates, flexible terms, and quick approval. 
                Get pre-qualified in minutes with no impact on your credit score.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-gold mb-1">2.99%</div>
                <div className="text-sm text-gray-200">Starting APR</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-gold mb-1">10%</div>
                <div className="text-sm text-gray-200">Min Down Payment</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-gold mb-1">5 Mins</div>
                <div className="text-sm text-gray-200">Pre-Qualify</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaCalculator />
              <span className="text-sm font-semibold">Payment Calculator</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Estimate Your Payment</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Use our calculator to see what your monthly payment could be
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Price</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (APR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (months)</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value={24}>24 months</option>
                    <option value={36}>36 months</option>
                    <option value={48}>48 months</option>
                    <option value={60}>60 months</option>
                    <option value={72}>72 months</option>
                    <option value={84}>84 months</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Results */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Your Estimated Payment</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly Payment:</span>
                    <span className="text-3xl font-bold text-gold">${calculateMonthlyPayment()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Interest:</span>
                    <span className="text-xl font-semibold">${totalInterest}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Amount:</span>
                    <span className="text-xl font-semibold">${totalAmount}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
                <h4 className="font-semibold text-primary mb-3">Ready to Apply?</h4>
                <p className="text-gray-700 mb-4">Get pre-qualified in minutes with no impact on your credit score.</p>
                <button className="w-full bg-accent hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all font-semibold">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaChartLine />
              <span className="text-sm font-semibold">Loan Options</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Find Your Perfect Rate</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Competitive rates tailored to your credit profile
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loanOptions.map((option, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  option.recommended ? 'ring-2 ring-gold transform scale-105' : ''
                }`}
              >
                {option.recommended && (
                  <div className="absolute top-0 right-0 bg-gold text-primary px-3 py-1 rounded-bl-lg text-sm font-semibold">
                    Recommended
                  </div>
                )}
                
                <div className="p-6">
                  <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center mb-4`}>
                    <FaStar className="text-white text-xl" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-2">{option.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Credit Score: {option.creditScore}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">APR:</span>
                      <span className="font-semibold">{option.apr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Down Payment:</span>
                      <span className="font-semibold">{option.downPayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Term:</span>
                      <span className="font-semibold">{option.term}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-sm" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaCheckCircle />
              <span className="text-sm font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Financing Benefits</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make financing simple, transparent, and affordable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-gold text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaQuestionCircle />
              <span className="text-sm font-semibold">Frequently Asked Questions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Financing Questions?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our financing options
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

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <FaCar className="text-gold" />
              <span className="text-sm font-medium">Get Started Today</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Drive Your Dream Car?
              </h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Get pre-qualified in minutes with no impact on your credit score. 
                Our team is here to help you find the perfect financing solution.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
                <FaFileAlt />
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
    </main>
  );
}

