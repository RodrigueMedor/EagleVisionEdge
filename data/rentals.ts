import { Rental } from '../types/rental';

export const rentals: Rental[] = [
  {
    id: 'R1',
    vehicleId: '9',
    driverName: 'Carlos Rivera',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    weeklyRate: 499,
    status: 'active',
  },
];

