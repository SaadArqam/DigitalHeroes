'use client';

import { ReactNode } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: ReactNode;
  className?: string;
  name?: string;
  required?: boolean;
}

export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  className = '',
  name,
  required,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-end transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`
            w-full bg-input-bg border-2 border-input-border text-white placeholder:text-text-muted
            rounded-2xl py-4 transition-all duration-200
            ${icon ? 'pl-12' : 'pl-5'} pr-5
            focus:outline-none focus:border-primary-start/50 focus:ring-4 focus:ring-primary-start/10
            group-hover:border-input-border/80
            font-bold text-sm
          `}
        />
      </div>
      {error && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}
