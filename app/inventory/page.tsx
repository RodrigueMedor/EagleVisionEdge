"use client";

import React, { useMemo, useState } from 'react';
import { vehicles as allVehicles } from '../../data/vehicles';
import VehicleCard from '../../components/VehicleCard';
import FilterSidebar from '../../components/FilterSidebar';
import { FaCar, FaSearch, FaSort, FaTh, FaList, FaExchangeAlt } from 'react-icons/fa';

export default function InventoryPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [compareList, setCompareList] = useState<string[]>([]);

  const makes = useMemo(() => Array.from(new Set(allVehicles.map((v) => v.make))), []);
  const bodyTypes = useMemo(() => Array.from(new Set(allVehicles.map((v) => v.bodyType))), []);
  const years = useMemo(() => Array.from(new Set(allVehicles.map((v) => v.year))).sort((a, b) => b - a), []);

  const filtered = useMemo(() => {
    const filtered = allVehicles.filter((v) => {
      if (filters.make && v.make !== filters.make) return false;
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false;
      if (filters.year && v.year !== filters.year) return false;
      if (filters.maxPrice && v.price > filters.maxPrice) return false;
      if (filters.minPrice && v.price < filters.minPrice) return false;
      if (filters.status && v.status !== filters.status) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!(v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.features.some(f => f.toLowerCase().includes(q)))) return false;
      }
      return true;
    });

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'mileage-low':
          return a.mileage - b.mileage;
        case 'mileage-high':
          return b.mileage - a.mileage;
        case 'make':
          return a.make.localeCompare(b.make);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(key => filters[key] && filters[key] !== '').length;
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const toggleCompare = (vehicleId: string) => {
    setCompareList(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId].slice(0, 3); // Limit to 3 vehicles
      }
    });
  };

  return (
    <main className="space-y-0">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary/95 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <FaCar className="text-gold" />
              <span className="text-sm font-medium">Complete Vehicle Inventory</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="block">Find Your</span>
                <span className="block text-gold">Perfect Vehicle</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Browse our curated selection of quality vehicles with transparent pricing and flexible financing options
              </p>
            </div>
            
            {/* Quick Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by make, model, or features..."
                  value={filters.query || ''}
                  onChange={(e) => handleFilterChange({ query: e.target.value })}
                  className="w-full px-6 py-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-lg"
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gold text-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar 
                makes={makes} 
                bodyTypes={bodyTypes} 
                years={years} 
                onFilterChange={handleFilterChange}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Vehicle Inventory</h2>
                    <p className="text-gray-600 mt-1">
                      Showing <span className="font-semibold text-accent">{filtered.length}</span> vehicles
                      {activeFiltersCount > 0 && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <FaSort className="text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="year-new">Year: Newest</option>
                        <option value="year-old">Year: Oldest</option>
                        <option value="mileage-low">Mileage: Low to High</option>
                        <option value="mileage-high">Mileage: High to Low</option>
                        <option value="make">Make: A-Z</option>
                      </select>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                      >
                        <FaTh className={viewMode === 'grid' ? 'text-accent' : 'text-gray-400'} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                      >
                        <FaList className={viewMode === 'list' ? 'text-accent' : 'text-gray-400'} />
                      </button>
                    </div>

                    {/* Compare Button */}
                    {compareList.length > 0 && (
                      <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        <FaExchangeAlt />
                        Compare ({compareList.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Grid/List */}
              {filtered.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
                  {filtered.map((vehicle) => (
                    <div key={vehicle.id} className="relative group">
                      <VehicleCard vehicle={vehicle} />
                      
                      {/* Compare Checkbox */}
                      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleCompare(vehicle.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            compareList.includes(vehicle.id)
                              ? 'bg-accent text-white'
                              : 'bg-white/90 backdrop-blur-sm hover:bg-accent hover:text-white'
                          }`}
                        >
                          <FaExchangeAlt className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2">No vehicles found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={clearFilters}
                    className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {filtered.length > 12 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-accent text-white rounded-lg">1</button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">2</button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">3</button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

