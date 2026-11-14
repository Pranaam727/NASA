import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const DisplayHeading: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1
    className={`font-display text-2xl md:text-3xl font-bold tracking-tight text-astro-text-primary ${className}`}
  >
    {children}
  </h1>
);

export const PageTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2
    className={`font-display text-xl md:text-2xl font-bold tracking-tight text-astro-text-primary ${className}`}
  >
    {children}
  </h2>
);

export const SectionTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3
    className={`font-display text-base font-semibold tracking-tight text-astro-text-primary ${className}`}
  >
    {children}
  </h3>
);

export const MetadataLabel: React.FC<
  TypographyProps & { uppercase?: boolean; subtle?: boolean }
> = ({ children, className = '', uppercase = true, subtle = false }) => (
  <span
    className={`font-mono text-[10px] md:text-[11px] tracking-wider ${
      uppercase ? 'uppercase' : ''
    } ${subtle ? 'text-astro-text-tertiary' : 'text-astro-text-secondary'} ${className}`}
  >
    {children}
  </span>
);

export const TechnicalValue: React.FC<
  TypographyProps & { size?: 'sm' | 'md' | 'lg' | 'hero'; weight?: 'normal' | 'medium' | 'bold' }
> = ({ children, className = '', size = 'md', weight = 'medium' }) => {
  const sizeMap = {
    sm: 'text-xs',
    md: 'text-sm md:text-base',
    lg: 'text-lg md:text-xl',
    hero: 'text-2xl md:text-3xl font-bold',
  };

  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  };

  return (
    <span
      className={`font-mono tabular-nums tracking-tight text-astro-text-primary ${sizeMap[size]} ${weightMap[weight]} ${className}`}
    >
      {children}
    </span>
  );
};
