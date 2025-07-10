"use client"

import { HairForm } from '@/components/gucci-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-brown-50">
      {/* Main Content */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-8">
        <HairForm />
      </div>
    </div>
  );
}