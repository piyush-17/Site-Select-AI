import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { getLocationsAnalysis } from './services/geminiService';
import { LocationAnalysis } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<LocationAnalysis[] | null>(null);
  const [userInput, setUserInput] = useState<{ area: string; businessType: string } | null>(null);


  const handleAnalysis = useCallback(async (area: string, businessType: string, investment: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);
    setUserInput({ area, businessType });

    try {
      const results = await getLocationsAnalysis(area, businessType, investment);
      setAnalysisResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section id="analysis-form" className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-2 text-teal-400">Find Your Next Profitable Location</h2>
            <p className="text-center text-gray-400 mb-8">
              Enter your business details below and let our AI engine analyze the best potential sites for you.
            </p>
            <InputForm onAnalyze={handleAnalysis} isLoading={isLoading} />
          </section>
          
          <section id="results">
            <ResultsDashboard 
              isLoading={isLoading}
              error={error}
              results={analysisResults}
              userInput={userInput}
            />
          </section>
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Site Select AI &copy; 2025</p>
      </footer>
    </div>
  );
};

export default App;