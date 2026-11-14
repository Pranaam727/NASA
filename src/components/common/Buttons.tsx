import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon: Icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-xs md:text-sm',
    lg: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    primary:
      'bg-astro-text-primary text-astro-bg-primary hover:bg-[#383E38] active:bg-[#1A1D1A] border border-astro-text-primary',
    secondary:
      'bg-transparent text-astro-text-primary hover:bg-astro-bg-subtle border border-astro-border-hairline',
    danger:
      'bg-astro-status-critical text-white hover:bg-[#A33D35] active:bg-[#8F332C] border border-astro-status-critical',
    ghost:
      'bg-transparent text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle border border-transparent',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-body font-medium rounded-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
      ) : null}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-3.5 h-3.5 ml-1.5 shrink-0" />
      )}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <PrimaryButton variant="secondary" {...props} />
);

export const IconButton: React.FC<
  Omit<ButtonProps, 'children'> & { icon: LucideIcon; label: string }
> = ({ icon: Icon, label, size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-sm text-astro-text-secondary hover:text-astro-text-primary hover:bg-astro-bg-subtle transition-colors duration-150 border border-transparent hover:border-astro-border-hairline ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};
