'use client';

import { useState } from 'react';

export default function SearchInput({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !loading) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a symbol — snake, water, tower, fire..."
        maxLength={80}
        disabled={loading}
        className="w-full bg-obsidian border border-smoke hover:border-gold-dim focus:border-gold
          rounded-lg px-5 py-4 pr-28 text-parchment text-lg font-light
          placeholder:text-parchment-dim/40
          outline-none transition-all duration-300
          disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="absolute right-2.5 top-1/2 -translate-y-1/2
          bg-gold/10 hover:bg-gold/20 text-gold
          px-4 py-2 rounded-md text-sm font-medium
          transition-all duration-200
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? 'Amplifying...' : 'Amplify'}
      </button>
    </form>
  );
}
