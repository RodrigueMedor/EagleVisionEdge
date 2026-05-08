export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  monthlyEstimate?: number;
  bodyType: string;
  images: string[];
  description: string;
  vin?: string;
  status: 'available' | 'sold' | 'rented';
  features: string[];
};
