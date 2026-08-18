// Shared FSDAMS logo — a growing plant/sprout, chosen because it's instantly
// recognizable to farmers (unlike an abstract shield or lock icon).
// Use this everywhere a logo appears, so it's guaranteed identical across screens.
export default function Logo({ size = 96, className = '' }) {
  return (
    <div
      className={`rounded-full bg-farmer-light/60 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        {/* Soil mound */}
        <path d="M4 19c1.5-1.2 3.5-1.8 8-1.8s6.5.6 8 1.8" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" />
        {/* Stem */}
        <path d="M12 19V11" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
        {/* Left leaf */}
        <path
          d="M12 13c-1-3-4-3.5-6.5-2.5C6 13.5 9 15 12 13z"
          fill="#4ade80" stroke="#16a34a" strokeWidth="0.8" strokeLinejoin="round"
        />
        {/* Right leaf */}
        <path
          d="M12 10.5c1-3.2 4.2-3.7 6.8-2.6C18.2 11 15 12.6 12 10.5z"
          fill="#22c55e" stroke="#16a34a" strokeWidth="0.8" strokeLinejoin="round"
        />
        {/* Top sprout tip */}
        <path
          d="M12 8.5c0-2 1-3.3 2.3-4.2C13.8 6.3 13 7.8 12 8.5z"
          fill="#86efac" stroke="#16a34a" strokeWidth="0.8" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
