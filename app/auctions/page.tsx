'use client';

import React, { useState, useEffect } from 'react';
import { FaCar, FaGavel, FaClock, FaDollarSign, FaUsers, FaEye, FaShieldAlt, FaQuestionCircle, FaTrophy, FaFire, FaExclamationTriangle } from 'react-icons/fa';

interface AuctionVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  image: string;
  description: string;
  currentBid: number;
  reservePrice: number;
  bidCount: number;
  timeLeft: number; // in hours
  status: 'active' | 'ending-soon' | 'ended';
  views: number;
  category: string;
  seller: string;
}

export default function AuctionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [selectedVehicle, setSelectedVehicle] = useState<AuctionVehicle | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [auctionVehicles, setAuctionVehicles] = useState<AuctionVehicle[]>([
    {
      id: '1',
      make: 'BMW',
      model: 'M3 Competition',
      year: 2022,
      mileage: 15000,
      image: '/images/vehicles/bmw-1.jpg',
      description: 'Pristine condition BMW M3 Competition with full service history. Performance package included.',
      currentBid: 45000,
      reservePrice: 48000,
      bidCount: 23,
      timeLeft: 2.5,
      status: 'ending-soon',
      views: 1250,
      category: 'luxury',
      seller: 'Premium Motors'
    },
    {
      id: '2',
      make: 'Ford',
      model: 'Mustang GT',
      year: 2021,
      mileage: 22000,
      image: '/images/vehicles/mustang-1.jpg',
      description: 'Well-maintained Mustang GT with performance exhaust and custom wheels.',
      currentBid: 32000,
      reservePrice: 35000,
      bidCount: 18,
      timeLeft: 5,
      status: 'active',
      views: 890,
      category: 'sports',
      seller: 'Speed Auto'
    },
    {
      id: '3',
      make: 'Toyota',
      model: 'Camry XLE',
      year: 2023,
      mileage: 8000,
      image: '/images/vehicles/camry-1.jpg',
      description: 'Like-new Toyota Camry with premium package and extended warranty.',
      currentBid: 28000,
      reservePrice: 29000,
      bidCount: 15,
      timeLeft: 8,
      status: 'active',
      views: 650,
      category: 'sedan',
      seller: 'Family Auto'
    },
    {
      id: '4',
      make: 'Mercedes',
      model: 'C300 AMG',
      year: 2022,
      mileage: 12000,
      image: '/images/vehicles/c300-1.jpg',
      description: 'Luxury Mercedes C300 AMG with panoramic roof and advanced safety features.',
      currentBid: 38000,
      reservePrice: 40000,
      bidCount: 31,
      timeLeft: 1.5,
      status: 'ending-soon',
      views: 1580,
      category: 'luxury',
      seller: 'Elite Cars'
    },
    {
      id: '5',
      make: 'Chevrolet',
      model: 'Silverado LT',
      year: 2022,
      mileage: 18000,
      image: '/images/vehicles/silverado-1.jpg',
      description: 'Heavy-duty Chevrolet Silverado with towing package and bed liner.',
      currentBid: 35000,
      reservePrice: 37000,
      bidCount: 12,
      timeLeft: 12,
      status: 'active',
      views: 420,
      category: 'truck',
      seller: 'Truck Center'
    },
    {
      id: '6',
      make: 'Honda',
      model: 'CR-V EX',
      year: 2023,
      mileage: 5000,
      image: '/images/vehicles/rav4-1.jpg',
      description: 'Certified Honda CR-V with Honda Sensing and low mileage.',
      currentBid: 26000,
      reservePrice: 27000,
      bidCount: 19,
      timeLeft: 6,
      status: 'active',
      views: 780,
      category: 'suv',
      seller: 'Reliable Motors'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Vehicles', icon: FaCar },
    { id: 'luxury', name: 'Luxury', icon: FaTrophy },
    { id: 'sports', name: 'Sports', icon: FaFire },
    { id: 'sedan', name: 'Sedans', icon: FaCar },
    { id: 'suv', name: 'SUVs', icon: FaCar },
    { id: 'truck', name: 'Trucks', icon: FaCar }
  ];

  const sortOptions = [
    { id: 'ending-soon', name: 'Ending Soon' },
    { id: 'newest', name: 'Newest Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'most-bids', name: 'Most Bids' }
  ];

  const auctionRules = [
    {
      icon: FaShieldAlt,
      title: 'Buyer Protection',
      description: 'All auctions include buyer protection and vehicle history reports.'
    },
    {
      icon: FaDollarSign,
      title: 'Reserve Prices',
      description: 'Some auctions have reserve prices that must be met for the sale to complete.'
    },
    {
      icon: FaClock,
      title: 'Auction Duration',
      description: 'Most auctions run for 7 days with automatic extensions for last-minute bids.'
    },
    {
      icon: FaUsers,
      title: 'Verified Bidders',
      description: 'All bidders must be verified before participating in auctions.'
    }
  ];

  const faqs = [
    {
      question: 'How do I place a bid?',
      answer: 'Click on any active auction, enter your bid amount, and confirm. You must be logged in and verified to bid.'
    },
    {
      question: 'What is a reserve price?',
      answer: 'A reserve price is the minimum price the seller will accept. The auction will not end below this price.'
    },
    {
      question: 'Can I retract a bid?',
      answer: 'Once placed, bids cannot be retracted. Please bid carefully and only if you intend to purchase the vehicle.'
    },
    {
      question: 'What happens if I win?',
      answer: 'You\'ll receive an email with payment instructions and vehicle pickup details. Payment is typically due within 3 days.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAuctionVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        timeLeft: Math.max(0, vehicle.timeLeft - 0.01),
        status: vehicle.timeLeft <= 2 ? 'ending-soon' : vehicle.timeLeft <= 0 ? 'ended' : 'active'
      })));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (hours: number) => {
    if (hours <= 0) return 'Ended';
    if (hours < 1) return `${Math.floor(hours * 60)}m`;
    if (hours < 24) return `${Math.floor(hours)}h ${Math.floor((hours % 1) * 60)}m`;
    return `${Math.floor(hours / 24)}d ${Math.floor(hours % 24)}h`;
  };

  const handleBid = () => {
    if (!selectedVehicle || !bidAmount) return;
    
    const bid = parseFloat(bidAmount);
    if (bid <= selectedVehicle.currentBid) {
      alert('Bid must be higher than current bid');
      return;
    }

    // Update the vehicle with new bid
    setAuctionVehicles(prev => prev.map(vehicle => 
      vehicle.id === selectedVehicle.id 
        ? { ...vehicle, currentBid: bid, bidCount: vehicle.bidCount + 1 }
        : vehicle
    ));

    alert(`Bid of $${bid.toLocaleString()} placed successfully!`);
    setBidAmount('');
    setShowBidModal(false);
    setSelectedVehicle(null);
  };

  const filteredVehicles = auctionVehicles
    .filter(vehicle => selectedCategory === 'all' || vehicle.category === selectedCategory)
    .filter(vehicle => vehicle.status !== 'ended')
    .sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return a.timeLeft - b.timeLeft;
        case 'price-low':
          return a.currentBid - b.currentBid;
        case 'price-high':
          return b.currentBid - a.currentBid;
        case 'most-bids':
          return b.bidCount - a.bidCount;
        default:
          return 0;
      }
    });

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
              <FaGavel className="text-gold" />
              <span className="text-sm font-medium">Live Vehicle Auctions</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="block">Bid on Your</span>
                <span className="block text-gold">Dream Car</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Join our live vehicle auctions and bid on quality pre-owned cars. 
                Transparent bidding with buyer protection guaranteed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-gold mb-1">{auctionVehicles.filter(v => v.status === 'active').length}</div>
                <div className="text-sm text-gray-200">Active Auctions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-gold mb-1">{auctionVehicles.reduce((sum, v) => sum + v.bidCount, 0)}</div>
                <div className="text-sm text-gray-200">Total Bids</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-gold mb-1">{Math.max(...auctionVehicles.map(v => v.currentBid), 0).toLocaleString()}</div>
                <div className="text-sm text-gray-200">Highest Bid</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-accent text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <category.icon className="inline mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Listings */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {vehicle.status === 'ending-soon' && (
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaExclamationTriangle />
                      Ending Soon
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaEye className="text-gray-600 text-sm" />
                      <span className="text-sm font-semibold">{vehicle.views}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.mileage.toLocaleString()} miles</p>
                    </div>
                    <span className="bg-gold/10 text-gold px-2 py-1 rounded-full text-xs font-semibold">
                      {vehicle.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vehicle.description}</p>

                  {/* Bidding Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Bid:</span>
                      <span className="text-xl font-bold text-primary">${vehicle.currentBid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bids:</span>
                      <span className="font-semibold">{vehicle.bidCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Time Left:</span>
                      <span className={`font-semibold ${vehicle.timeLeft <= 2 ? 'text-accent' : 'text-gray-700'}`}>
                        {formatTimeLeft(vehicle.timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setBidAmount((vehicle.currentBid + 500).toString());
                        setShowBidModal(true);
                      }}
                      className="flex-1 bg-accent hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-all font-semibold"
                    >
                      <FaGavel className="inline mr-2" />
                      Place Bid
                    </button>
                    <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No active auctions</h3>
              <p className="text-gray-500">Check back soon for new vehicle auctions</p>
            </div>
          )}
        </div>
      </section>

      {/* Auction Rules */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-4">
              <FaShieldAlt />
              <span className="text-sm font-semibold">Auction Rules</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Bid with Confidence</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our auction platform is designed to be safe, transparent, and fair for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {auctionRules.map((rule, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <rule.icon className="text-gold text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{rule.title}</h3>
                <p className="text-gray-600">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 mb-4">
              <FaQuestionCircle />
              <span className="text-sm font-semibold">Auction FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our vehicle auctions
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bid Modal */}
      {showBidModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowBidModal(false)}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-primary">Place Your Bid</h3>
                <p className="text-gray-600 mt-1">{selectedVehicle.make} {selectedVehicle.model}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Current Bid:</span>
                    <span className="text-xl font-bold text-primary">${selectedVehicle.currentBid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Minimum Bid:</span>
                    <span className="font-semibold">${(selectedVehicle.currentBid + 500).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Enter your bid"
                    />
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> By placing this bid, you commit to purchase the vehicle if you win. 
                    All bids are binding and cannot be retracted.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowBidModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBid}
                    className="flex-1 bg-accent hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all font-semibold"
                  >
                    <FaGavel className="inline mr-2" />
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
