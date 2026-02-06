'use client';

export default function CategorySection({ name, icon, content, index }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${(index + 1) * 100}ms` }}
    >
      <div className={index > 0 ? 'border-t border-smoke/60 pt-8' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl" role="img" aria-label={name}>
            {icon}
          </span>
          <h3 className="font-serif text-xl text-gold font-medium">{name}</h3>
        </div>
        <div className="text-parchment/80 font-light leading-relaxed space-y-3 pl-10">
          {content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
