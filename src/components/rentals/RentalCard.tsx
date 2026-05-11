import { Car, Users, Package, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface RentalCardProps {
  image: string
  name: string
  type: string
  price: string
  capacity?: string
  cargo?: string
  available: boolean
  className?: string
  onReserve?: (vehicle: {
    name: string
    type: string
    price: string
    capacity?: string
    cargo?: string
  }) => void
}

export default function RentalCard({
  image,
  name,
  type,
  price,
  capacity,
  cargo,
  available,
  className,
  onReserve
}: RentalCardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow', className)}>
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className={cn(
          'absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold',
          available 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        )}>
          {available ? 'Available' : 'Unavailable'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{type}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary">
            {price}
            <span className="text-sm text-gray-500 font-normal">/day</span>
          </div>
        </div>

        {(capacity || cargo) && (
          <div className="flex gap-4 mb-4 text-sm text-gray-600">
            {capacity && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{capacity}</span>
              </div>
            )}
            {cargo && (
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{cargo}</span>
              </div>
            )}
          </div>
        )}

        <Button
          variant={available ? 'primary' : 'secondary'}
          size="sm"
          className="w-full"
          disabled={!available}
          onClick={() => onReserve?.({ name, type, price, capacity, cargo })}
        >
          {available ? 'Reserve Now' : 'Not Available'}
        </Button>
      </div>
    </div>
  )
}
