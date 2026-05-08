export type Rental = {
  id: string;
  vehicleId: string;
  driverName: string;
  startDate: string;
  endDate: string;
  weeklyRate: number;
  status: 'active' | 'completed' | 'overdue';
};
