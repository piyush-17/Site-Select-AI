
import React from 'react';
import { LocationAnalysis } from '../types';
import { LocationCard } from './LocationCard';
import { Loader } from './Loader';
import { MapPinIcon } from './Icons';

interface ResultsDashboardProps {
  isLoading: boolean;
  error: string | null;
  results: LocationAnalysis[] | null;
  userInput: { area: string; businessType: string } | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ isLoading, error, results, userInput }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-6 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Analysis Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
        <div className="text-center text-gray-500 py-16 px-6 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
            <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-gray-600"/>
            <h3 className="text-xl font-semibold text-gray-300">Ready to Discover Opportunities?</h3>
            <p className="mt-2">Your location analysis results will appear here.</p>
        </div>
    );
  }
  
  if (results.length === 0) {
      return (
          <div className="text-center text-gray-500 py-16">
              <h3 className="text-xl font-semibold">No Suitable Locations Found</h3>
              <p>Try adjusting your search criteria for better results.</p>
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">
        Top Locations for a <span className="text-teal-400">{userInput?.businessType}</span> in <span className="text-teal-400">{userInput?.area}</span>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {results.sort((a,b) => b.overallScore - a.overallScore).map((location, index) => (
          <LocationCard key={index} location={location} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};
