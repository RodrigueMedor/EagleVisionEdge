'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // mock submit
    alert('Thanks! Message submitted. (Mock)');
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      <h4 className="font-semibold mb-3">Contact Us</h4>
      <div className="space-y-3">
        <input
          className="w-full rounded-md border-gray-200 p-2"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-md border-gray-200 p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="w-full rounded-md border-gray-200 p-2"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="bg-primary text-white px-4 py-2 rounded-md">Send Message</button>
      </div>
    </form>
  );
}

