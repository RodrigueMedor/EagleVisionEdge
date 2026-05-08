import React from 'react';
import { Lead } from '../types/lead';

export default function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{lead.name}</div>
          <div className="text-sm text-gray-500">{lead.email || '—'} • {lead.phone || '—'}</div>
        </div>
        <div className="text-sm text-right">
          <div className="text-gray-500">{lead.source}</div>
          <div className={`mt-2 text-xs px-2 py-1 rounded-full ${lead.status === 'new' ? 'bg-yellow-100 text-yellow-800' : lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{lead.status}</div>
        </div>
      </div>
    </div>
  );
}

