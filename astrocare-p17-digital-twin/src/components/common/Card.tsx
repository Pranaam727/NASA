import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'violet' | 'teal' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = 'none',
  onClick,
}) => {
  const glowStyles = {
    none: '',
    cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]',
    violet: 'hover:border-violet-500/50 hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.15)]',
    teal: 'hover:border-teal-500/50 hover:shadow-[0_0_15px_-3px_rgba(20,184,166,0.15)]',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 transition-all duration-200 ${glowStyles[glow]} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
