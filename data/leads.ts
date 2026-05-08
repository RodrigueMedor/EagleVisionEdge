import { Lead } from '../types/lead';

export const leads: Lead[] = [
  {
    id: 'L1',
    name: 'Maria Gonzalez',
    phone: '305-555-0123',
    email: 'maria@example.com',
    vehicleId: '1',
    source: 'website',
    status: 'new',
    notes: ['Requested financing info'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'L2',
    name: 'John Smith',
    phone: '786-555-0198',
    email: 'john@example.com',
    vehicleId: '3',
    source: 'call',
    status: 'contacted',
    notes: ['Interested in towing package'],
    createdAt: new Date().toISOString(),
  },
];

