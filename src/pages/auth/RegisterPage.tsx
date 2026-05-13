import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authService } from '@/services/authService'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/authSlice'
import { useNotification } from '@/hooks'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { success, error: showError } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
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
      }
      dispatch(loginSuccess(transformedResponse))
      success('Registration successful!')
      navigate('/dashboard')
    } catch (err: any) {
      const message = err.message || 'Registration failed'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary/80 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 animate-slideUp">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-gray-600">Join Eagle Vision Edge</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-secondary font-semibold transition-smooth">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

