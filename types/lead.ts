export type Lead = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  vehicleId?: string;
  source: 'website' | 'walk-in' | 'call' | 'rental';
  status: 'new' | 'contacted' | 'closed';
  notes?: string[];
  createdAt: string;
};
