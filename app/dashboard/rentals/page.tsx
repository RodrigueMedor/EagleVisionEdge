import React from 'react';
import { rentals } from '../../../data/rentals';
import RentalCard from '../../../components/RentalCard';

export default function DashboardRentals() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Rental Management</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rentals.map((r) => (
          <RentalCard key={r.id} rental={r} />
        ))}
      </div>
    </div>
  );
}

