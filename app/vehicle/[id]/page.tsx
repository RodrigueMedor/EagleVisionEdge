import React from 'react';
import { vehicles } from '../../../data/vehicles';
import Link from 'next/link';
import ContactForm from '../../../components/ContactForm';
import CTA from '../../../components/CTA';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return vehicles.map((vehicle) => ({
    id: vehicle.id,
  }));
}

export default function VehiclePage({ params }: Props) {
  const vehicle = vehicles.find((v) => v.id === params.id);
  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="h-72 bg-gray-100 mb-4 flex items-center justify-center">
            <img src={vehicle.images[0] || '/images/placeholder-vehicle.png'} alt={`${vehicle.make} ${vehicle.model}`} className="object-cover h-full w-full" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
              <div className="text-sm text-gray-500">VIN: {vehicle.vin || '—'}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">${vehicle.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{vehicle.status}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Specifications</h4>
              <ul className="text-sm mt-2 space-y-1 text-gray-600">
                <li>Body: {vehicle.bodyType}</li>
                <li>Mileage: {vehicle.mileage.toLocaleString()} miles</li>
                <li>Year: {vehicle.year}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Features</h4>
              <ul className="text-sm mt-2 space-y-1 text-gray-600">
                {vehicle.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Description</h4>
            <p className="text-gray-700 mt-2">{vehicle.description}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 rounded-md bg-primary text-white">Apply Now</button>
            <button className="px-4 py-2 rounded-md border">Schedule Test Drive</button>
            <Link href="/contact" className="px-4 py-2 rounded-md border">Contact Dealer</Link>
          </div>
        </div>
      </div>

      <aside>
        <div className="space-y-4">
          <ContactForm />
          <CTA title="Financing Options" subtitle="See estimated monthly payments and pre-qualify quickly." cta="Get Pre-Qualified" />
        </div>
      </aside>
    </div>
  );
}

