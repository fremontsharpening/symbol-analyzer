'use client';

import CategorySection from './CategorySection';

export default function SymbolCard({ data }) {
  return (
    <div className="animate-fade-in-up">
      {/* Symbol title */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-4xl md:text-5xl text-parchment font-semibold capitalize italic">
          {data.symbol}
        </h2>
      </div>

      {/* Overview */}
      <div className="bg-obsidian rounded-xl p-6 md:p-8 mb-6 border border-smoke">
        <div className="text-parchment/85 font-light leading-relaxed text-lg font-serif italic space-y-4">
          {data.overview.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-obsidian rounded-xl p-6 md:p-8 border border-smoke space-y-8">
        {data.categories.map((category, index) => (
          <CategorySection
            key={category.name}
            name={category.name}
            icon={category.icon}
            content={category.content}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
