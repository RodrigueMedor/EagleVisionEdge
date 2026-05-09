'use client';

import React, { useState } from 'react';
import { FaMagic, FaSearch } from 'react-icons/fa';
import { vehicles } from '../data/vehicles';
import VehicleCard from './VehicleCard';

interface SearchFilter {
  query: string;
  budgetMin: number;
  budgetMax: number;
  fuelType: string;
  bodyType: string;
}

export default function SmartVehicleSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    query: '',
    budgetMin: 0,
    budgetMax: 100000,
    fuelType: '',
    bodyType: '',
  });
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);

  const handleSearch = () => {
    const results = vehicles.filter((vehicle) => {
      // Price filter
      if (
        vehicle.price < filters.budgetMin ||
        vehicle.price > filters.budgetMax
      ) {
        return false;
      }

      // Body type filter
      if (
        filters.bodyType &&
        !vehicle.bodyType.toLowerCase().includes(filters.bodyType.toLowerCase())
      ) {
        return false;
      }

      // Natural language search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const vehicleText = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.bodyType}`.toLowerCase();
        return vehicleText.includes(query);
      }

      return true;
    });

    setFilteredVehicles(results);
  };

  const handleAISearch = (suggestion: string) => {
    setFilters({ ...filters, query: suggestion });
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const aiSuggestions = [
    'Family SUV',
    'Reliable truck',
    'Budget sedan',
    'Luxury car',
    'Fuel efficient',
  ];

  return (
    <div className="w-full">
      {/* Smart Search Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-2xl shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaMagic className="text-gold text-2xl" />
          <h2 className="text-3xl font-bold">Smart Vehicle Search</h2>
        </div>
        <p className="text-gray-100 mb-6">
          Use natural language to find your perfect vehicle. Just describe what
          you're looking for!
        </p>

        {/* Main Search Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={filters.query}
            onChange={(e) =>
              setFilters({ ...filters, query: e.target.value })
            }
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="E.g., 'reliable family SUV under $30k' or 'fuel efficient sedan'"
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            onClick={handleSearch}
            className="bg-gold hover:bg-yellow-600 text-primary px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <FaSearch />
            Search
          </button>
        </div>

        {/* AI Suggestions */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm opacity-75">Try:</span>
          {aiSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleAISearch(suggestion)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm transition-colors border border-white/30"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-6 flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors"
      >
        <FaSearch />
        {isExpanded ? 'Hide Filters' : 'Show Advanced Filters'}
      </button>

      {isExpanded && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Budget Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget Range
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.budgetMin}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      budgetMin: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.budgetMax}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      budgetMax: parseInt(e.target.value) || 100000,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Body Type
              </label>
              <select
                value={filters.bodyType}
                onChange={(e) =>
                  setFilters({ ...filters, bodyType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>

            {/* Apply Filters */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <h3 className="text-2xl font-bold text-primary mb-6">
          Found {filteredVehicles.length} vehicle
          {filteredVehicles.length !== 1 ? 's' : ''}
        </h3>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No vehicles match your criteria.
            </p>
            <button
              onClick={() =>
                setFilters({
                  query: '',
                  budgetMin: 0,
                  budgetMax: 100000,
                  fuelType: '',
                  bodyType: '',
                })
              }
              className="text-primary font-semibold hover:text-secondary"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

