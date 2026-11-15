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
        className={`bg-[#06110F] border rounded-sm px-3 py-1.5 text-xs md:text-sm text-[#E8F4F0] placeholder:text-[#57766D] focus:border-[#21E6D0] focus:ring-1 focus:ring-[#21E6D0]/30 outline-none transition-colors duration-150 ${
          error ? 'border-[#FF6475]' : 'border-[rgba(55,210,185,0.2)]'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="font-mono text-[10px] text-[#FF6475]">{error}</span>
      ) : helperText ? (
        <span className="font-body text-[11px] text-[#8CA8A0]">{helperText}</span>
      ) : null}
    </div>
  );
};

export const SearchInput: React.FC<TextInputProps> = ({ className = '', ...props }) => {
  return (
    <div className="relative flex items-center">
      <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#57766D] pointer-events-none" />
      <input
        type="search"
        className={`w-full bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#E8F4F0] placeholder:text-[#57766D] focus:border-[#21E6D0] focus:ring-1 focus:ring-[#21E6D0]/30 outline-none transition-colors duration-150 ${className}`}
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
          className="font-mono text-[11px] uppercase tracking-wider text-[#8CA8A0]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`bg-[#06110F] border rounded-sm px-3 py-1.5 text-xs md:text-sm text-[#E8F4F0] focus:border-[#21E6D0] focus:ring-1 focus:ring-[#21E6D0]/30 outline-none transition-colors duration-150 ${
          error ? 'border-[#FF6475]' : 'border-[rgba(55,210,185,0.2)]'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0A1715] text-[#E8F4F0]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="font-mono text-[10px] text-[#FF6475]">{error}</span>}
    </div>
  );
};
