'use client';

import React, { useState, useEffect } from 'react';
import { stats } from '../../data/stats';
import { vehicles } from '../../data/vehicles';
import StatsCard from '../../components/StatsCard';
import { FaChartLine, FaCar, FaUsers, FaDollarSign, FaBell, FaArrowUp, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function DashboardHome() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [viewPeriod, setViewPeriod] = useState('week');
  const [notifications, setNotifications] = useState<Array<{ id: number; type: string; message: string; time: string; read: boolean }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ id: number; action: string; details: string; time: string; icon: any; color: string }>>([]);
  const [lowStockVehicles, setLowStockVehicles] = useState<any[]>([]);
  const [vehicleViews, setVehicleViews] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock notifications
    const mockNotifications = [
      { id: 1, type: 'lead', message: 'New lead: John Doe interested in Toyota Camry', time: '2 min ago', read: false },
      { id: 2, type: 'sale', message: 'Vehicle sold: Honda Civic LX', time: '1 hour ago', read: false },
      { id: 3, type: 'inventory', message: 'Low stock alert: Only 3 sedans available', time: '3 hours ago', read: true },
      { id: 4, type: 'payment', message: 'Payment received: $1,200 from rental', time: '5 hours ago', read: true },
    ];
    setNotifications(mockNotifications);

    // Generate mock recent activity
    const mockActivity = [
      { id: 1, action: 'Test Drive Scheduled', details: 'Sarah Miller - Ford F-150', time: '10 min ago', icon: FaCar, color: 'text-blue-600' },
      { id: 2, action: 'New Lead', details: 'Mike Johnson - SUV inquiry', time: '25 min ago', icon: FaUsers, color: 'text-green-600' },
      { id: 3, action: 'Payment Received', details: '$450 - Rental payment', time: '1 hour ago', icon: FaDollarSign, color: 'text-purple-600' },
      { id: 4, action: 'Vehicle Added', details: '2022 Chevrolet Equinox', time: '2 hours ago', icon: FaCar, color: 'text-orange-600' },
    ];
    setRecentActivity(mockActivity);

    // Find low stock vehicles
    const lowStock = vehicles.filter(v => v.status === 'available').slice(0, 3);
    setLowStockVehicles(lowStock);

    // Generate mock vehicle views data
    const mockVehicleViews = vehicles.map(vehicle => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      status: vehicle.status,
      views: {
        today: Math.floor(Math.random() * 50) + 10,
        week: Math.floor(Math.random() * 200) + 50,
        month: Math.floor(Math.random() * 800) + 200,
        total: Math.floor(Math.random() * 2000) + 500
      },
      trend: Math.random() > 0.5 ? 'up' : 'down',
      trendPercentage: (Math.random() * 40 - 10).toFixed(1)
    }));
    setVehicleViews(mockVehicleViews);
  }, []);

  const chartData = [
    { month: 'Jan', sales: 12, revenue: 125000 },
    { month: 'Feb', sales: 19, revenue: 189000 },
    { month: 'Mar', sales: 15, revenue: 156000 },
    { month: 'Apr', sales: 25, revenue: 245000 },
    { month: 'May', sales: 22, revenue: 218000 },
    { month: 'Jun', sales: 30, revenue: 298000 },
  ];

  const performanceMetrics = [
    { label: 'Conversion Rate', value: '24%', change: '+3.2%', trend: 'up' },
    { label: 'Avg Sale Price', value: '$18,500', change: '+$1,200', trend: 'up' },
    { label: 'Days on Lot', value: '28 days', change: '-5 days', trend: 'down' },
    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your dealership today.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaBell className="text-sm" />
            <span>Notifications</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Vehicles" value={stats.totalVehicles} icon={FaCar} color="bg-blue-500" />
        <StatsCard title="Vehicles Sold" value={stats.vehiclesSold} icon={FaCheckCircle} color="bg-green-500" />
        <StatsCard title="Active Rentals" value={stats.activeRentals} icon={FaClock} color="bg-purple-500" />
        <StatsCard title="Pending Leads" value={stats.pendingLeads} icon={FaUsers} color="bg-orange-500" />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <FaArrowUp className={metric.trend === 'down' ? 'rotate-180' : ''} />
                <span>{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Views Analytics */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Vehicle Views Analytics</h3>
          <select 
            value={viewPeriod} 
            onChange={(e) => setViewPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="total">All Time</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              {vehicleViews
                .sort((a, b) => b.views[viewPeriod] - a.views[viewPeriod])
                .slice(0, 8)
                .map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-gray-500">ID: {vehicle.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        ${vehicle.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : vehicle.status === 'sold'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {vehicle.views[viewPeriod].toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min((vehicle.views[viewPeriod] / Math.max(...vehicleViews.map(v => v.views[viewPeriod]))) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-1 ${
                        vehicle.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <FaArrowUp className={`text-xs ${vehicle.trend === 'down' ? 'rotate-180' : ''}`} />
                        <span className="text-sm font-medium">
                          {vehicle.trendPercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Views Progress Bar</span>
            </div>
            <div className="flex items-center gap-2">
              <FaArrowUp className="text-green-600 text-xs" />
              <span>Increasing</span>
            </div>
            <div className="flex items-center gap-2">
              <FaArrowUp className="text-red-600 text-xs rotate-180" />
              <span>Decreasing</span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All Vehicles →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg relative group cursor-pointer hover:from-blue-700 hover:to-blue-500 transition-colors"
                     style={{ height: `${(data.revenue / 300000) * 100}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${data.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-gray-600">Units Sold</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                  <activity.icon className="text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Alerts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
            <FaExclamationTriangle className="text-orange-500" />
          </div>
          <div className="space-y-3">
            {lowStockVehicles.length > 0 ? (
              lowStockVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    <p className="text-xs text-gray-600">{vehicle.bodyType} • ${vehicle.price.toLocaleString()}</p>
                  </div>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">Low Stock</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No inventory alerts at this time.</p>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {notifications.filter(n => !n.read).length} New
            </span>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 4).map((notification) => (
              <div key={notification.id} className={`p-3 rounded-lg border ${
                notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaCar className="text-blue-600 text-xl mx-auto mb-2" />
            <span className="text-sm text-gray-700">Add Vehicle</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaUsers className="text-green-600 text-xl mx-auto mb-2" />
            <span className="text-sm text-gray-700">Add Lead</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaDollarSign className="text-purple-600 text-xl mx-auto mb-2" />
            <span className="text-sm text-gray-700">Record Sale</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <FaChartLine className="text-orange-600 text-xl mx-auto mb-2" />
            <span className="text-sm text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}

