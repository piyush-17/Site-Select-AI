import React, { useRef, useEffect } from 'react';
import { LocationAnalysis } from '../types';
import { AnalysisChart } from './AnalysisChart';
import { MapPinIcon, UsersIcon, TrendingUpIcon, ShieldCheckIcon, DollarSignIcon } from './Icons';

interface LocationCardProps {
  location: LocationAnalysis;
  rank: number;
}

const MapView: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any | null>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            import('leaflet').then(L => {
                if (mapContainerRef.current && !mapInstanceRef.current) {
                    const map = L.map(mapContainerRef.current, {
                        scrollWheelZoom: false, // Disable zoom on scroll for better page navigation
                    }).setView([lat, lon], 15);
                    mapInstanceRef.current = map;

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    L.marker([lat, lon]).addTo(map);
                }
            });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lon]);

    return <div ref={mapContainerRef} className="w-full h-full" />;
};


const formatCurrencyINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const baseClasses = "px-3 py-1 text-sm font-bold rounded-full";
    const styles = {
        Low: "bg-green-800 text-green-200",
        Medium: "bg-yellow-800 text-yellow-200",
        High: "bg-red-800 text-red-200",
    };
    return <span className={`${baseClasses} ${styles[level]}`}>{level} Risk</span>;
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-gray-900/70 p-4 rounded-lg text-center">
        <div className="text-teal-400 w-8 h-8 mx-auto mb-2">{icon}</div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
    </div>
);


export const LocationCard: React.FC<LocationCardProps> = ({ location, rank }) => {

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-teal-500 hover:shadow-teal-500/10">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <div className="flex items-center space-x-4">
               <span className="flex-shrink-0 w-12 h-12 bg-gray-900 text-teal-400 text-xl font-bold rounded-full flex items-center justify-center border-2 border-teal-500">#{rank}</span>
               <div>
                <h3 className="text-2xl font-bold text-white">{location.locationName}</h3>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                    <MapPinIcon className="w-4 h-4 mr-2"/>
                    <span>{location.address}</span>
                </div>
               </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col items-end">
             <div className="text-4xl font-extrabold text-teal-400">{location.overallScore}<span className="text-2xl text-gray-400">/100</span></div>
             <p className="text-sm text-gray-500">Overall Score</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6">{location.summary}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Demographics & Risk */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-4 flex items-center"><UsersIcon className="w-5 h-5 mr-2 text-teal-400"/>Demographics & Market</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={<TrendingUpIcon/>} label="Foot Traffic" value={location.marketAnalysis.footTraffic} />
                        <StatCard icon={<ShieldCheckIcon/>} label="Competition" value={location.marketAnalysis.competitorDensity} />
                        <StatCard icon={<UsersIcon/>} label="Population" value={location.demographics.populationDensity} />
                        <StatCard icon={<DollarSignIcon/>} label="Avg. Income" value={formatCurrencyINR(location.demographics.avgIncome)} />
                    </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-4 flex items-center"><ShieldCheckIcon className="w-5 h-5 mr-2 text-teal-400"/>Risk Assessment</h4>
                    <div className="flex items-center space-x-4">
                        <RiskBadge level={location.risk.level} />
                        <p className="text-gray-300 text-sm">{location.risk.factors}</p>
                    </div>
                </div>
            </div>

            {/* Middle Column - Financials */}
            <div className="lg:col-span-1 bg-gray-700/50 p-4 rounded-lg flex flex-col">
                <h4 className="font-bold text-lg mb-4 flex items-center"><DollarSignIcon className="w-5 h-5 mr-2 text-teal-400"/>Financial Projections</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <StatCard icon={<DollarSignIcon/>} label="5-Year ROI" value={`${location.financials.roi.toFixed(1)}%`} />
                    <StatCard icon={<TrendingUpIcon/>} label="Breakeven" value={`Year ${location.financials.breakEvenYear}`} />
                </div>
                <div className="flex-grow h-64 w-full">
                    <AnalysisChart financials={location.financials} />
                </div>
            </div>

            {/* Right Column - Map */}
             <div className="lg:col-span-1 bg-gray-700/50 p-4 rounded-lg flex flex-col">
                 <h4 className="font-bold text-lg mb-4 flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-teal-400"/>Geospatial View</h4>
                 <div className="w-full h-48 rounded-md overflow-hidden border border-gray-600 shadow-inner">
                    <MapView lat={location.latitude} lon={location.longitude} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};