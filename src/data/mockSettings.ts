import { DealershipSettings } from '@/types/settings'

export const mockDealershipSettings: DealershipSettings = {
  id: 'dealership_001',
  name: 'Eagle Vision Edge Motors',
  logo: '/images/logos/dealership-logo.png',
  address: {
    street: '1234 Business Highway',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    country: 'USA'
  },
  contact: {
    phone: '(305) 555-0100',
    email: 'info@eaglevisionedge.com',
    website: 'https://eaglevisionedge.com'
  },
  businessHours: {
    monday: { open: '09:00', close: '21:00', closed: false },
    tuesday: { open: '09:00', close: '21:00', closed: false },
    wednesday: { open: '09:00', close: '21:00', closed: false },
    thursday: { open: '09:00', close: '21:00', closed: false },
    friday: { open: '09:00', close: '21:00', closed: false },
    saturday: { open: '09:00', close: '19:00', closed: false },
    sunday: { open: '12:00', close: '18:00', closed: false }
  },
  branding: {
    primaryColor: '#1e40af',
    secondaryColor: '#dc2626',
    accentColor: '#16a34a',
    theme: 'light'
  },
  features: {
    financing: true,
    rentals: true,
    auctions: true,
    tradeIns: true,
    warranties: true,
    delivery: true
  },
  socialMedia: {
    facebook: 'https://facebook.com/eaglevisionedge',
    instagram: 'https://instagram.com/eaglevisionedge',
    twitter: 'https://twitter.com/eaglevisionedge',
    linkedin: 'https://linkedin.com/company/eaglevisionedge',
    youtube: 'https://youtube.com/eaglevisionedge'
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    leadAlerts: true,
    financingAlerts: true,
    rentalAlerts: true,
    inventoryAlerts: true,
    systemUpdates: true,
    marketingEmails: false
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-11-20')
}
