import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-primary text-white p-8">
      <h1 className="text-4xl font-bold text-gold mb-4">Test Page</h1>
      <div className="bg-accent p-6 rounded-lg">
        <p className="text-xl">This should be red with white text</p>
      </div>
      <div className="bg-gold p-6 rounded-lg mt-4">
        <p className="text-primary">This should be gold with dark text</p>
      </div>
    </div>
  );
}
