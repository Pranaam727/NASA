import React from 'react';

interface SpaceBlobProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'large' | 'medium' | 'small' | 'pill';
  animate?: boolean;
}

export const SpaceBlob: React.FC<SpaceBlobProps> = ({
  className = '',
  children,
  variant = 'medium',
  animate = true,
}) => {
  const sizeMap = {
    large: 'w-[420px] h-[380px] sm:w-[580px] sm:h-[520px]',
    medium: 'w-[280px] h-[260px] sm:w-[380px] sm:h-[350px]',
    small: 'w-[180px] h-[160px] sm:w-[220px] sm:h-[200px]',
    pill: 'w-full h-auto min-h-[140px]',
  };

  return (
    <div
      className={`relative bg-[#111111] starfield-pattern text-[#F2F0EA] overflow-hidden ${
        animate ? 'animate-morph-blob' : 'rounded-[40px]'
      } ${sizeMap[variant]} shadow-2xl transition-all duration-700 ${className}`}
      style={{
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.45), inset 0 0 40px rgba(0,0,0,0.8)',
      }}
    >
      {/* Inner ambient glow rim */}
      <div className="absolute inset-0 rounded-[inherit] border border-white/10 pointer-events-none" />
      <div className="relative z-10 w-full h-full p-6 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};
