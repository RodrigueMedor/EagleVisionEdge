'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-16">
      <div className="p-4">
        <h3 className="font-semibold text-lg">Dealer Dashboard</h3>
        <nav className="mt-6 space-y-2 text-sm">
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-50">Overview</Link>
          <Link href="/dashboard/inventory" className="block p-2 rounded hover:bg-gray-50">Inventory</Link>
          <Link href="/dashboard/leads" className="block p-2 rounded hover:bg-gray-50">Leads</Link>
          <Link href="/dashboard/rentals" className="block p-2 rounded hover:bg-gray-50">Rentals</Link>
          <Link href="/dashboard/analytics" className="block p-2 rounded hover:bg-gray-50">Analytics</Link>
        </nav>
      </div>
    </aside>
  );
}

