import React from 'react';
import { Search } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-[11px] uppercase tracking-wider text-astro-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-white border rounded-sm px-3 py-1.5 text-xs md:text-sm text-astro-text-primary placeholder:text-astro-text-tertiary focus:border-astro-border-focus focus:ring-1 focus:ring-astro-border-focus outline-none transition-colors duration-150 ${
          error ? 'border-astro-status-critical' : 'border-astro-border-hairline'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="font-mono text-[10px] text-astro-status-critical">{error}</span>
      ) : helperText ? (
        <span className="font-body text-[11px] text-astro-text-tertiary">{helperText}</span>
      ) : null}
    </div>
  );
};

export const SearchInput: React.FC<TextInputProps> = ({ className = '', ...props }) => {
  return (
    <div className="relative flex items-center">
      <Search className="w-3.5 h-3.5 absolute left-2.5 text-astro-text-tertiary pointer-events-none" />
      <input
        type="search"
        className={`w-full bg-white border border-astro-border-hairline rounded-sm pl-8 pr-3 py-1.5 text-xs text-astro-text-primary placeholder:text-astro-text-tertiary focus:border-astro-border-focus focus:ring-1 focus:ring-astro-border-focus outline-none transition-colors duration-150 ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  error,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="font-mono text-[11px] uppercase tracking-wider text-astro-text-secondary"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`bg-white border rounded-sm px-3 py-1.5 text-xs md:text-sm text-astro-text-primary focus:border-astro-border-focus focus:ring-1 focus:ring-astro-border-focus outline-none transition-colors duration-150 ${
          error ? 'border-astro-status-critical' : 'border-astro-border-hairline'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="font-mono text-[10px] text-astro-status-critical">{error}</span>}
    </div>
  );
};
