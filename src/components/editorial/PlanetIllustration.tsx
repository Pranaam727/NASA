import React from 'react';

interface PlanetIllustrationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const PlanetIllustration: React.FC<PlanetIllustrationProps> = ({
  className = '',
  size = 'hero',
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-72 h-72',
    hero: 'w-80 h-80 sm:w-96 sm:h-96 lg:w-[460px] lg:h-[460px]',
  };

  return (
    <div
      className={`relative select-none pointer-events-none flex items-center justify-center ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_25px_50px_rgba(17,17,17,0.35)]"
      >
        <defs>
          {/* Sphere Spherical Gradient */}
          <radialGradient id="planetGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E0DDD3" />
            <stop offset="65%" stopColor="#242424" />
            <stop offset="100%" stopColor="#111111" />
          </radialGradient>

          {/* Ring Gradient */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8B8B3" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#FF6B35" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#75D8DC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#111111" stopOpacity="0.3" />
          </linearGradient>

          {/* Mask for Ring Behind Sphere */}
          <mask id="planetMask">
            <rect width="400" height="400" fill="white" />
            <circle cx="200" cy="200" r="100" fill="black" />
          </mask>
        </defs>

        {/* Ambient Ring Glow */}
        <ellipse
          cx="200"
          cy="200"
          rx="185"
          ry="65"
          transform="rotate(-25 200 200)"
          stroke="rgba(117, 216, 220, 0.25)"
          strokeWidth="12"
          fill="none"
        />

        {/* Back Half of Rings (behind planet) */}
        <g mask="url(#planetMask)">
          <ellipse
            cx="200"
            cy="200"
            rx="180"
            ry="58"
            transform="rotate(-25 200 200)"
            stroke="url(#ringGrad)"
            strokeWidth="24"
            fill="none"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="192"
            ry="62"
            transform="rotate(-25 200 200)"
            stroke="#242424"
            strokeWidth="3"
            strokeDasharray="6 8"
            fill="none"
          />
        </g>

        {/* Main Planet Sphere */}
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="url(#planetGrad)"
          stroke="#111111"
          strokeWidth="3"
        />

        {/* Atmospheric Latitude Stripes */}
        <path
          d="M 105 180 Q 200 220 295 180"
          stroke="rgba(255, 107, 53, 0.25)"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 112 160 Q 200 200 288 160"
          stroke="rgba(117, 216, 220, 0.2)"
          strokeWidth="6"
          fill="none"
        />
        <path
          d="M 120 225 Q 200 260 280 225"
          stroke="rgba(17, 17, 17, 0.4)"
          strokeWidth="10"
          fill="none"
        />

        {/* Subtle Crater Circles */}
        <circle cx="160" cy="150" r="12" stroke="#242424" strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="230" cy="220" r="16" stroke="#242424" strokeWidth="2" fill="none" opacity="0.3" />
        <circle cx="175" cy="240" r="8" stroke="#242424" strokeWidth="1.5" fill="none" opacity="0.3" />

        {/* Front Half of Rings (passes in front of planet) */}
        <g style={{ clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)' }}>
          <ellipse
            cx="200"
            cy="200"
            rx="180"
            ry="58"
            transform="rotate(-25 200 200)"
            stroke="url(#ringGrad)"
            strokeWidth="24"
            fill="none"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="155"
            ry="48"
            transform="rotate(-25 200 200)"
            stroke="#111111"
            strokeWidth="2"
            fill="none"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="192"
            ry="62"
            transform="rotate(-25 200 200)"
            stroke="#111111"
            strokeWidth="2"
            strokeDasharray="4 6"
            fill="none"
          />
        </g>

        {/* Satellite in Orbit */}
        <g transform="translate(340, 140) rotate(20)">
          <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#242424" stroke="#111111" strokeWidth="1.5" />
          <line x1="-18" y1="0" x2="-8" y2="0" stroke="#75D8DC" strokeWidth="2" />
          <line x1="8" y1="0" x2="18" y2="0" stroke="#75D8DC" strokeWidth="2" />
          <rect x="-24" y="-8" width="8" height="16" rx="1" fill="#75D8DC" />
          <rect x="18" y="-8" width="8" height="16" rx="1" fill="#75D8DC" />
        </g>
      </svg>
    </div>
  );
};
