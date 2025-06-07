'use client';

import React, { useState } from 'react';
import { BackgroundGradient } from './ui/background-gradient';
import { AlertTriangle } from 'lucide-react';

export default function SosButton() {
  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendSOS = async () => {
    setStatus('Sending...');

    if (!name || !recipient || !customMessage) {
      setStatus('⚠️ Please fill out all fields');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch('/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              recipient,
              message: customMessage,
              location: {
                latitude,
                longitude,
                mapLink: `https://maps.google.com/?q=${latitude},${longitude}`,
              },
            }),
          });

          const data = await response.json();
          setStatus(`✅ ${data.message}`);
        } catch (error) {
          setStatus('❌ Failed to send SOS');
          console.error(error);
        }
      },
      (error) => {
        setStatus('❌ Location permission denied or error fetching location');
        console.error('Geolocation error:', error);
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <BackgroundGradient className="rounded-[20px] p-6 sm:p-10 bg-white dark:bg-zinc-800 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-600 w-6 h-6" />
          <h2 className="text-2xl font-bold text-red-600">Send SOS Alert</h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="email"
            placeholder="Recipient Email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <textarea
            placeholder="Emergency message"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
          />

          <button
            onClick={sendSOS}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all"
          >
            🚨 Send SOS
          </button>

          {status && (
            <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 text-center">
              {status}
            </p>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
}
