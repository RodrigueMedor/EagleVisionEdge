'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Vehicle } from '../types/vehicle';
import { FaCar, FaDollarSign, FaTachometerAlt, FaStar, FaHeart, FaShare, FaPhone, FaImage, FaExpand } from 'react-icons/fa';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <FaImage className="text-gray-400 text-4xl animate-pulse" />
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <FaImage className="text-4xl mb-2 mx-auto" />
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        ) : vehicle.images[0].endsWith('.svg') ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            <div className="text-center text-white">
              <FaCar className="text-6xl mb-4 mx-auto" />
              <h3 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h3>
              <p className="text-lg">{vehicle.year}</p>
            </div>
          </div>
        ) : (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            className={`object-cover h-full w-full group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              vehicle.status === 'available' 
                ? 'bg-green-500 text-white' 
                : vehicle.status === 'sold' 
                ? 'bg-red-500 text-white' 
                : 'bg-yellow-500 text-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full bg-current animate-pulse`}></div>
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <FaHeart className="text-gray-700 hover:text-red-500" />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <FaShare className="text-gray-700 hover:text-blue-500" />
          </button>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 bg-accent text-white px-3 py-2 rounded-lg">
          <div className="text-lg font-bold">${vehicle.price.toLocaleString()}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-primary mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FaTachometerAlt className="text-accent" />
              <span>{vehicle.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCar className="text-accent" />
              <span>{vehicle.bodyType}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                +{vehicle.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Monthly Payment */}
        {vehicle.monthlyEstimate && (
          <div className="mb-4 bg-gold/10 border border-gold/20 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Est. Monthly Payment</span>
              <span className="text-gold font-bold">${vehicle.monthlyEstimate}/mo</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/vehicle/${vehicle.id}`}
            className="flex-1 bg-primary hover:bg-secondary text-white px-4 py-3 rounded-xl font-semibold transition-colors text-center"
          >
            View Details
          </Link>
          <button className="w-12 h-12 bg-accent hover:bg-red-700 text-white rounded-xl flex items-center justify-center transition-colors">
            <FaPhone />
          </button>
        </div>
      </div>
    </div>
  );
}

