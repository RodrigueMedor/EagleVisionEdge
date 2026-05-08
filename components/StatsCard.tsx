import React from 'react';

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = "bg-blue-500" 
}: { 
  title: string; 
  value: string | number; 
  icon?: React.ComponentType<any>; 
  color?: string; 
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
        </div>
        {Icon && (
          <div className={`p-3 ${color} rounded-lg`}>
            <Icon className="text-white text-xl" />
          </div>
        )}
      </div>
    </div>
  );
}

