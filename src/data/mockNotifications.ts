import { Notification } from '@/types/notifications'

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Welcome to EagleVision Edge',
    message: 'Your account has been successfully set up.',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    read: false,
    priority: 'low',
    userId: 'user1'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Vehicle Maintenance Due',
    message: 'Vehicle VIN123456789 requires maintenance.',
    timestamp: new Date('2024-01-14T14:30:00Z'),
    createdAt: new Date('2024-01-14T14:30:00Z'),
    read: false,
    entityId: 'VIN123456789',
    entityType: 'vehicle',
    priority: 'medium',
    userId: 'user1'
  },
  {
    id: '3',
    type: 'success',
    title: 'Lead Converted',
    message: 'Lead John Doe has been converted to a customer.',
    timestamp: new Date('2024-01-13T09:15:00Z'),
    createdAt: new Date('2024-01-13T09:15:00Z'),
    read: true,
    entityId: 'lead1',
    entityType: 'lead',
    priority: 'high',
    userId: 'user1'
  },
  {
    id: '4',
    type: 'error',
    title: 'Payment Failed',
    message: 'Payment for rental RENT001 has failed.',
    timestamp: new Date('2024-01-12T16:45:00Z'),
    createdAt: new Date('2024-01-12T16:45:00Z'),
    read: false,
    entityId: 'RENT001',
    entityType: 'rental',
    priority: 'high',
    userId: 'user1'
  },
  {
    id: '5',
    type: 'info',
    title: 'New Inventory Added',
    message: 'New vehicle Toyota Camry 2024 has been added to inventory.',
    timestamp: new Date('2024-01-11T11:20:00Z'),
    createdAt: new Date('2024-01-11T11:20:00Z'),
    read: true,
    entityId: 'vehicle1',
    entityType: 'vehicle',
    priority: 'low',
    userId: 'user1'
  }
]
