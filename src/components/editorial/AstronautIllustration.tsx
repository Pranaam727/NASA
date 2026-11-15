import React from 'react';

interface AstronautIllustrationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  floating?: boolean;
}

export const AstronautIllustration: React.FC<AstronautIllustrationProps> = ({
  className = '',
  size = 'md',
  floating = true,
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-72 h-72',
    hero: 'w-80 h-80 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px]',
  };

  return (
    <div
      className={`relative select-none pointer-events-none ${sizeMap[size]} ${
        floating ? 'animate-float-slow' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)]"
      >
        {/* Umbilical Tether / Life Support Cable */}
        <path
          d="M 60 280 C 40 220, 90 190, 110 160 C 125 140, 120 110, 140 100"
          stroke="#B8B8B3"
          strokeWidth="3"
          strokeDasharray="4 4"
          fill="none"
        />

        {/* Shadow under feet / body */}
        <ellipse cx="150" cy="270" rx="45" ry="10" fill="rgba(17,17,17,0.12)" />

        {/* Life Support Backpack (PLSS) */}
        <rect
          x="100"
          y="70"
          width="42"
          height="80"
          rx="10"
          fill="#242424"
          stroke="#111111"
          strokeWidth="3"
        />
        <rect x="108" y="80" width="12" height="60" rx="4" fill="#444444" />
        <circle cx="130" cy="90" r="5" fill="#FF6B35" />
        <circle cx="130" cy="110" r="5" fill="#75D8DC" />

        {/* Left Arm (Floating outwards) */}
        <path
          d="M 130 95 C 100 105, 80 130, 70 160"
          stroke="#F2F0EA"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 130 95 C 100 105, 80 130, 70 160"
          stroke="#111111"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ clipPath: 'inset(0)' }}
        />
        <path
          d="M 130 95 C 100 105, 80 130, 70 160"
          stroke="#F2F0EA"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Glove */}
        <circle cx="70" cy="160" r="10" fill="#242424" stroke="#111111" strokeWidth="2" />

        {/* Torso Suit */}
        <rect
          x="125"
          y="75"
          width="55"
          height="75"
          rx="18"
          fill="#F2F0EA"
          stroke="#111111"
          strokeWidth="3.5"
        />
        {/* Chest Display Module (DCM) */}
        <rect
          x="137"
          y="90"
          width="32"
          height="38"
          rx="6"
          fill="#111111"
          stroke="#242424"
          strokeWidth="1.5"
        />
        <rect x="142" y="96" width="22" height="12" rx="2" fill="#242424" />
        {/* Status LEDs on Suit */}
        <circle cx="145" cy="118" r="2.5" fill="#75D8DC" />
        <circle cx="153" cy="118" r="2.5" fill="#FF6B35" />
        <circle cx="161" cy="118" r="2.5" fill="#B8B8B3" />

        {/* Right Arm (Reaching Forward) */}
        <path
          d="M 175 95 C 205 105, 220 120, 235 140"
          stroke="#111111"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 175 95 C 205 105, 220 120, 235 140"
          stroke="#F2F0EA"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Glove with Telemetry Ring */}
        <circle cx="235" cy="140" r="11" fill="#242424" stroke="#111111" strokeWidth="2" />
        <circle cx="235" cy="140" r="15" stroke="#75D8DC" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Left Leg */}
        <path
          d="M 140 145 C 130 180, 115 210, 105 240"
          stroke="#111111"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 140 145 C 130 180, 115 210, 105 240"
          stroke="#F2F0EA"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Boot */}
        <path
          d="M 95 240 L 118 240 L 122 254 L 88 254 Z"
          fill="#242424"
          stroke="#111111"
          strokeWidth="3"
        />

        {/* Right Leg */}
        <path
          d="M 165 145 C 175 180, 190 205, 205 235"
          stroke="#111111"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 165 145 C 175 180, 190 205, 205 235"
          stroke="#F2F0EA"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Boot */}
        <path
          d="M 195 235 L 220 235 L 226 249 L 190 249 Z"
          fill="#242424"
          stroke="#111111"
          strokeWidth="3"
        />

        {/* Helmet */}
        <circle
          cx="152"
          cy="50"
          r="26"
          fill="#F2F0EA"
          stroke="#111111"
          strokeWidth="3.5"
        />
        {/* Gold / Charcoal Visor */}
        <ellipse
          cx="156"
          cy="48"
          rx="18"
          ry="15"
          fill="#111111"
          stroke="#242424"
          strokeWidth="2"
        />
        {/* Visor Glare / Specular Highlight */}
        <path
          d="M 144 42 C 148 38, 160 38, 166 43"
          stroke="#75D8DC"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="165" cy="52" r="2.5" fill="#FF6B35" />

        {/* Mission Patch / Flag */}
        <rect x="168" y="80" width="8" height="5" fill="#FF6B35" />
      </svg>
    </div>
  );
};
