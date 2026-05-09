import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authService } from '@/services/authService'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess, setLoading } from '@/store/slices/authSlice'
import { useNotification } from '@/hooks'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@igr.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { success, error: showError } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    dispatch(setLoading(true))

    try {
      const response = await authService.login({ email, password })
      dispatch(loginSuccess(response))
      success('Login successful!')
      navigate('/dashboard')
    } catch (err: any) {
      const message = err.message || 'Login failed'
      setError(message)
      showError(message)
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary/80 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 animate-slideUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your dealer dashboard</p>
          </div>

          {/* Form */}
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
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-primary hover:text-secondary transition-smooth">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
            </div>
          </div>

          {/* Demo info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-1 mb-6">
            <p className="font-semibold text-blue-900">Admin Account</p>
            <p className="text-blue-800 text-xs">Email: admin@igr.com</p>
            <p className="text-blue-800 text-xs">Password: admin123</p>
          </div>

          {/* Sign up link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-secondary font-semibold transition-smooth">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

