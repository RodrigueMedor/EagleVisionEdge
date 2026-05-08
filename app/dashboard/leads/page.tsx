import React from 'react';
import { leads } from '../../../data/leads';
import LeadCard from '../../../components/LeadCard';

export default function DashboardLeads() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Leads Management</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((l) => (
          <LeadCard key={l.id} lead={l} />
        ))}
      </div>
    </div>
  );
}

