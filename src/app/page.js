'use client';

import { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import SymbolCard from '@/components/SymbolCard';
import LoadingState from '@/components/LoadingState';
import { DEMO_DATA } from '@/lib/demoData';

export default function Home() {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    setSymbol(query);
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/amplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: query }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setSymbol('snake');
    setResult(DEMO_DATA);
    setError(null);
    setHasSearched(true);
  };

  const handleReset = () => {
    setSymbol('');
    setResult(null);
    setError(null);
    setHasSearched(false);
  };

  return (
    <main className="min-h-screen">
      <div
        className={`transition-all duration-700 ease-in-out ${
          hasSearched ? 'pt-8' : 'pt-[25vh]'
        }`}
      >
        {/* Header */}
        <div
          className={`text-center transition-all duration-700 ${
            hasSearched ? 'mb-6' : 'mb-10'
          }`}
        >
          <h1
            onClick={handleReset}
            className={`font-serif font-semibold text-gold transition-all duration-700 cursor-pointer hover:text-gold/80 ${
              hasSearched ? 'text-2xl' : 'text-5xl md:text-6xl'
            }`}
          >
            Symbol Amplifier
          </h1>
          {!hasSearched && (
            <p className="mt-4 text-parchment-dim font-light text-lg max-w-xl mx-auto px-4">
              A medium to the collective unconscious. Enter a symbol and
              discover its resonance across mythology, religion, and culture.
            </p>
          )}
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto px-4">
          <SearchInput onSearch={handleSearch} loading={loading} />
          {!hasSearched && (
            <div className="text-center mt-4">
              <button
                onClick={handleDemo}
                className="text-parchment-dim/60 hover:text-gold text-sm transition-colors duration-200"
              >
                or try an example &mdash; &ldquo;snake&rdquo;
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto px-4 mt-8 pb-16">
          {loading && <LoadingState symbol={symbol} />}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400/80 text-lg">{error}</p>
              <p className="text-parchment-dim text-sm mt-3">
                Make sure your GEMINI_API_KEY is set in .env.local
              </p>
            </div>
          )}
          {result && !loading && <SymbolCard data={result} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center text-parchment-dim/30 text-xs bg-gradient-to-t from-void to-transparent pointer-events-none">
        Amplifications are generated, not authored. Verify against primary sources.
      </footer>
    </main>
  );
}
