import React from 'react';
import { Link } from 'wouter';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="text-6xl font-bold text-primary mb-4">404</div>
      <h1 className="text-3xl font-bold mb-6 text-center">Page Not Found</h1>
      <p className="text-gray-600 text-lg max-w-md text-center mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <span className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
          Return to Homepage
        </span>
      </Link>
    </div>
  );
};

export default NotFound;