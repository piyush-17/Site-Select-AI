
import React from 'react';
import { CompassIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CompassIcon className="w-8 h-8 text-teal-400" />
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Site Select <span className="text-teal-400">AI</span>
          </h1>
        </div>
        <nav>
          <a href="#analysis-form" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
};
