'use client';

export default function LoadingState({ symbol }) {
  return (
    <div className="text-center py-16">
      {/* Pulsing orb */}
      <div className="inline-flex items-center justify-center mb-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border border-gold/20 animate-pulse-slow" />
          <div className="absolute inset-3 rounded-full border border-gold/30 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-6 rounded-full bg-gold/15 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <p className="text-parchment-dim font-serif text-xl italic">
        Amplifying <span className="text-gold">{symbol}</span>
      </p>
      <p className="text-parchment-dim/40 text-sm mt-2 font-light">
        Consulting the collective unconscious
      </p>

      {/* Skeleton cards */}
      <div className="mt-12 space-y-4">
        <div className="h-28 rounded-xl animate-shimmer" />
        <div className="h-64 rounded-xl animate-shimmer" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}
