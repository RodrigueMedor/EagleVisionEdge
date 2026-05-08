'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCar, FaBars, FaTimes, FaGavel, FaSignOutAlt, FaPhone } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on component mount
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated') {
        setIsAuthenticated(e.newValue === 'true');
      }
    };

    // Listen for custom login events from same tab
    const handleLoginEvent = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleLoginEvent);
    
    // Check auth state periodically as fallback
    const interval = setInterval(() => {
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(prev => {
        const current = authStatus === 'true';
        return prev !== current ? current : prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleLoginEvent);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    
    // Redirect to homepage
    window.location.href = '/';
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <FaCar className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                    IGR AUTO SALES
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Premium Auto Dealership</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link href="/inventory" className="text-gray-700 hover:text-accent font-medium transition-colors relative group">
                  Inventory
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/rentals" className="text-gray-700 hover:text-accent font-medium transition-colors relative group">
                  Rentals
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/auctions" className="text-gray-700 hover:text-accent font-medium transition-colors relative group">
                  <FaGavel className="inline mr-2" />
                  Auctions
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/financing" className="text-gray-700 hover:text-accent font-medium transition-colors relative group">
                  Financing
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-accent font-medium transition-colors relative group">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-accent font-medium transition-colors relative group">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                </Link>
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors relative group flex items-center gap-2"
                  >
                    <FaSignOutAlt className="text-sm" />
                    Logout
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                  </button>
                )}
              </nav>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group cursor-pointer">
                  <div className="relative">
                    <FaPhone className="text-white text-lg" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-red-100 font-medium">Call Now</span>
                    <span className="text-base font-bold text-white group-hover:text-red-100 transition-colors">(407) 201-3109</span>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-primary text-2xl"
                >
                  {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden pb-4 space-y-2">
          <Link
            href="/inventory"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Inventory
          </Link>
          <Link
            href="/rentals"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Rentals
          </Link>
          <Link
            href="/auctions"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaGavel className="text-sm" />
            Auctions
          </Link>
          <Link
            href="/financing"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Financing
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 bg-accent text-white rounded transition-colors flex items-center gap-2"
            >
              <FaSignOutAlt className="text-sm" />
              Logout
            </button>
          )}
          <a
            href="tel:4072013109"
            className="mx-4 my-2 block px-4 py-3 bg-gradient-to-r from-accent/90 to-accent hover:from-accent hover:to-red-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 font-semibold text-center justify-center shadow-md"
          >
            <FaPhone className="text-sm" />
            Call (407) 201-3109
          </a>
        </div>
      )}
    </>
  );
}
