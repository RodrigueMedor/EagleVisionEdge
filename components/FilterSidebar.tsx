'use client';

import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes, FaCar, FaDollarSign, FaCalendar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

type Props = {
  makes: string[];
  bodyTypes: string[];
  years: number[];
  onFilterChange: (filters: { make?: string; bodyType?: string; year?: number; maxPrice?: number; query?: string; minPrice?: number; status?: string }) => void;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
};

export default function FilterSidebar({ makes, bodyTypes, years, onFilterChange, activeFiltersCount = 0, onClearFilters }: Props) {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    price: true,
    vehicle: true,
    features: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-accent" />
          <h3 className="text-xl font-bold text-primary">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-accent transition-colors flex items-center gap-1"
          >
            <FaTimes />
            Clear
          </button>
        )}
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('search')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h4 className="font-semibold text-primary flex items-center gap-2">
            <FaSearch />
            Search
          </h4>
          {expandedSections.search ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        
        {expandedSections.search && (
          <div className="space-y-3">
            <div>
              <input
                type="text"
                onChange={(e) => onFilterChange({ query: e.target.value })}
                placeholder="Search make, model, or features..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h4 className="font-semibold text-primary flex items-center gap-2">
            <FaDollarSign />
            Price Range
          </h4>
          {expandedSections.price ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <select
                onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              >
                <option value="">No minimum</option>
                <option value="10000">$10,000</option>
                <option value="15000">$15,000</option>
                <option value="20000">$20,000</option>
                <option value="25000">$25,000</option>
                <option value="30000">$30,000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <select
                onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              >
                <option value="">No maximum</option>
                <option value="20000">$20,000</option>
                <option value="25000">$25,000</option>
                <option value="30000">$30,000</option>
                <option value="35000">$35,000</option>
                <option value="40000">$40,000</option>
                <option value="50000">$50,000+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Details Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('vehicle')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h4 className="font-semibold text-primary flex items-center gap-2">
            <FaCar />
            Vehicle Details
          </h4>
          {expandedSections.vehicle ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        
        {expandedSections.vehicle && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Make</label>
              <select
                onChange={(e) => onFilterChange({ make: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              >
                <option value="">All Makes</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Body Type</label>
              <select
                onChange={(e) => onFilterChange({ bodyType: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                {bodyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center gap-2">
                <FaCalendar />
                Year
              </label>
              <select
                onChange={(e) => onFilterChange({ year: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                onChange={(e) => onFilterChange({ status: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-primary mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange({ maxPrice: 20000 })}
            className="px-3 py-1 bg-gray-100 hover:bg-accent hover:text-white text-gray-700 rounded-full text-sm transition-colors"
          >
            Under $20k
          </button>
          <button
            onClick={() => onFilterChange({ bodyType: 'SUV' })}
            className="px-3 py-1 bg-gray-100 hover:bg-accent hover:text-white text-gray-700 rounded-full text-sm transition-colors"
          >
            SUVs
          </button>
          <button
            onClick={() => onFilterChange({ status: 'available' })}
            className="px-3 py-1 bg-gray-100 hover:bg-accent hover:text-white text-gray-700 rounded-full text-sm transition-colors"
          >
            Available
          </button>
          <button
            onClick={() => onFilterChange({ year: new Date().getFullYear() })}
            className="px-3 py-1 bg-gray-100 hover:bg-accent hover:text-white text-gray-700 rounded-full text-sm transition-colors"
          >
            New Models
          </button>
        </div>
      </div>
    </aside>
  );
}

