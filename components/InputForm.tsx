import React, { useState } from 'react';
import { SearchIcon } from './Icons';
import { indianCities, businessTypes } from '../data/suggestions';

interface InputFormProps {
  onAnalyze: (area: string, businessType: string, investment: string) => void;
  isLoading: boolean;
}

const SuggestionInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    suggestionsData: string[];
}> = ({ id, label, value, onChange, placeholder, suggestionsData }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue);
        if (inputValue) {
            const filtered = suggestionsData.filter(s =>
                s.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <input
                type="text"
                id={id}
                value={value}
                onChange={handleChange}
                onFocus={() => { if(value && suggestions.length > 0) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                placeholder={placeholder}
                required
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-20 w-full bg-gray-600 border border-gray-500 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onMouseDown={() => handleSelect(suggestion)}
                            className="px-3 py-2 text-white cursor-pointer hover:bg-teal-600"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [area, setArea] = useState<string>('Bengaluru, Karnataka');
  const [businessType, setBusinessType] = useState<string>('Cloud Kitchen');
  const [investment, setInvestment] = useState<string>('5000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area && businessType && investment) {
      onAnalyze(area, businessType, investment);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SuggestionInput
            id="area"
            label="City / Area (India)"
            value={area}
            onChange={setArea}
            placeholder="e.g., South Mumbai"
            suggestionsData={indianCities}
        />
        <SuggestionInput
            id="business-type"
            label="Business Type"
            value={businessType}
            onChange={setBusinessType}
            placeholder="e.g., Boutique Cafe"
            suggestionsData={businessTypes}
        />
        <div>
          <label htmlFor="investment" className="block text-sm font-medium text-gray-300 mb-2">
            Initial Investment (INR)
          </label>
          <input
            type="number"
            id="investment"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="e.g., 5000000"
            required
          />
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
        >
          {isLoading ? (
            'Analyzing...'
          ) : (
            <>
              <SearchIcon className="w-5 h-5 mr-2" />
              Analyze Locations
            </>
          )}
        </button>
      </div>
    </form>
  );
};
