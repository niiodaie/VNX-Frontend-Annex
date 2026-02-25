import React from 'react';
import { Footer } from '@/components/Footer';

export default function ResetPasswordConfirm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold">Nexus Tracker</h1>
        <p className="mt-2 text-gray-600 text-lg">Simplified project & task management for small teams and solo founders.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Password Reset Confirmation</h1>
          <p className="text-gray-600">
            Please check your email and follow the link to confirm your password reset.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}