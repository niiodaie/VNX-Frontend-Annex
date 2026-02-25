import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the MuseLab component
const MuseLab = lazy(() => import('./muse-lab'));

// Create a wrapper with loading state
const MuseLabWrapper = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="ml-3 text-xl text-purple-300">Loading MuseLab...</p>
      </div>
    }>
      <MuseLab />
    </Suspense>
  );
};

export default MuseLabWrapper;