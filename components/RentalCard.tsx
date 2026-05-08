import React from 'react';
import { Rental } from '../types/rental';

export default function RentalCard({ rental }: { rental: Rental }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{rental.driverName}</div>
          <div className="text-sm text-gray-500">{new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}</div>
        </div>
        <div className="text-right">
          <div className="font-bold">${rental.weeklyRate}/wk</div>
          <div className="text-xs text-gray-500">{rental.status}</div>
        </div>
      </div>
    </div>
  );
}

