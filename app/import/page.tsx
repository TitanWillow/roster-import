'use client';

import React from 'react';
import { PortfolioUrlForm } from '../../components/importer/PortfolioUrlForm';

export default function ImportPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 antialiased">
      <div className="text-center mb-10 max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Create Your <span className="text-orange-500">Roster</span> Profile Instantly
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Paste your portfolio link to instantly generate a professional profile.
          Modern, fast and ready to share.
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <PortfolioUrlForm />
      </div>
    </main>
  );
}