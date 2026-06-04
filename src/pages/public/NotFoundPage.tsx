import { Link } from 'react-router-dom'
import { Car, Home, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Car className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-6xl font-black text-primary mb-2">404</h1>
        <p className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </Link>
          <Link to="/inventory">
            <Button variant="secondary" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" /> Browse Inventory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
