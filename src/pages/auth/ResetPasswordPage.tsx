import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authService } from '@/services/authService'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.resetPassword(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary/80 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 animate-slideUp">
          {submitted ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary mb-2">Check Your Email</h1>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to {email}
              </p>
              <Link to="/login">
                <Button variant="primary" size="lg" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
                <p className="text-gray-600">Enter your email to receive reset instructions</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                  Send Reset Link
                </Button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                <Link to="/login" className="text-primary hover:text-secondary font-semibold transition-smooth">
                  Back to Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

