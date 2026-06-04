import { useState } from 'react'
import { Clock, CheckCircle, ArrowRight } from 'lucide-react'

const timeSlots = [
  '9:00 AM EST', '10:00 AM EST', '11:00 AM EST', '2:00 PM EST', '3:00 PM EST', '4:00 PM EST'
]

const roles = [
  'Dealership Owner', 'General Manager', 'Sales Manager',
  'Finance Manager', 'Rental Manager', 'Marketing Director', 'Other'
]

const benefits = [
  'Live platform walkthrough',
  'Custom implementation plan',
  'ROI analysis for your dealership',
  'Q&A with dealership technology expert',
  'Special demo pricing options',
]

export default function ScheduleDemoPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dealership: '', role: '', preferredTime: '', message: '',
  })

  const update = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Demo Scheduled!</h2>
          <p className="text-gray-500 mb-6">
            We'll confirm your appointment within 24 hours. Check your email for details.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Back to Home
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase">Schedule a Demo</span>
          <h1 className="text-4xl font-bold text-primary mt-2">See Eagle Vision Edge in Action</h1>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Fill out the form below and we'll set up a personalized walkthrough of the platform
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  <span className={`text-sm font-medium hidden sm:inline ${step >= s ? 'text-primary' : 'text-gray-400'}`}>
                    {s === 1 ? 'Info' : s === 2 ? 'Details' : 'Confirm'}
                  </span>
                  {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8">
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-primary mb-1">Your Information</h2>
                  <p className="text-gray-500 text-sm mb-6">Tell us a bit about yourself</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">First Name *</label>
                      <input
                        value={formData.firstName}
                        onChange={e => update('firstName', e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Last Name *</label>
                      <input
                        value={formData.lastName}
                        onChange={e => update('lastName', e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => update('email', e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => update('phone', e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-primary mb-1">Dealership Details</h2>
                  <p className="text-gray-500 text-sm mb-6">Help us tailor the demo to your needs</p>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Dealership Name *</label>
                    <input
                      value={formData.dealership}
                      onChange={e => update('dealership', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Your Role *</label>
                      <select
                        value={formData.role}
                        onChange={e => update('role', e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      >
                        <option value="">Select your role</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Preferred Time *</label>
                      <select
                        value={formData.preferredTime}
                        onChange={e => update('preferredTime', e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Additional Notes</label>
                    <textarea
                      value={formData.message}
                      onChange={e => update('message', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-primary mb-1">Confirm Your Details</h2>
                  <p className="text-gray-500 text-sm mb-6">Please review before submitting</p>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                    {[
                      ['Name', `${formData.firstName} ${formData.lastName}`],
                      ['Email', formData.email],
                      ['Phone', formData.phone],
                      ['Dealership', formData.dealership],
                      ['Role', formData.role],
                      ['Preferred Time', formData.preferredTime],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium text-primary">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all"
                  >
                    Back
                  </button>
                ) : <div />}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    className="px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    Schedule Demo
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
              <h3 className="font-bold text-primary mb-4">What You'll See</h3>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
              <Clock className="w-8 h-8 text-gold mb-3" />
              <h3 className="font-bold mb-1">30-Minute Demo</h3>
              <p className="text-sm text-gray-300">We respect your time. Our demos are focused and efficient.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
