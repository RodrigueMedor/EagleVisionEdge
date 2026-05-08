'use client';

import React from 'react';
import Link from 'next/link';
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold rounded-xl flex items-center justify-center">
                <FaCar className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">IGR AUTO SALES</h3>
                <p className="text-xs text-gray-400">Premium Auto Dealership</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for quality vehicles, transparent pricing, and exceptional service in Florida since 2010.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <FaFacebook className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <FaYoutube className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/inventory" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gold rounded-full"></span>
                  Vehicle Inventory
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gold rounded-full"></span>
                  Rental Services
                </Link>
              </li>
              <li>
                <Link href="/financing" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gold rounded-full"></span>
                  Financing Options
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gold rounded-full"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gold rounded-full"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-gold rounded-full"></span>
                Car Sales
              </li>
              <li className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-gold rounded-full"></span>
                Vehicle Rentals
              </li>
              <li className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-gold rounded-full"></span>
                Trade-ins
              </li>
              <li className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-gold rounded-full"></span>
                Extended Warranty
              </li>
              <li className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-gold rounded-full"></span>
                Vehicle Inspection
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaPhone className="text-accent mt-1" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p className="text-gray-300">(407) 201-3109</p>
                  <p className="text-sm text-gray-400">Mon-Fri: 9AM-7PM, Sat: 9AM-5PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-accent mt-1" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-gray-300">hello@igrauto.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent mt-1" />
                <div>
                  <p className="font-medium text-white">Location</p>
                  <p className="text-gray-300">2598 N Orange Blossom Trail</p>
                  <p className="text-gray-300">Kissimmee, FL 34744</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} IGR AUTO SALES. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-gold transition-colors">Sitemap</Link>
              <div className="flex items-center gap-2">
                <span>Powered with</span>
                <span className="text-accent">♥</span>
                <span>in Florida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

