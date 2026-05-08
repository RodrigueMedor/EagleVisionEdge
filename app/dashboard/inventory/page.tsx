import React from 'react';
import { vehicles } from '../../../data/vehicles';

export default function DashboardInventory() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      <div className="mt-4 bg-white rounded p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">{vehicles.length} vehicles</div>
          <button className="bg-primary text-white px-3 py-1 rounded">Add Vehicle</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="pb-2">ID</th>
                <th className="pb-2">Make</th>
                <th className="pb-2">Model</th>
                <th className="pb-2">Year</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody className="mt-2">
              {vehicles.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="py-2">{v.id}</td>
                  <td className="py-2">{v.make}</td>
                  <td className="py-2">{v.model}</td>
                  <td className="py-2">{v.year}</td>
                  <td className="py-2">${v.price.toLocaleString()}</td>
                  <td className="py-2">{v.status}</td>
                  <td className="py-2">
                    <button className="text-sm text-primary">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

