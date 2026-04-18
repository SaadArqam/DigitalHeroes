'use client';

import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#7C3AED] transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full h-14 bg-[#1F2937]/50 border-2 border-[#374151] rounded-2xl 
              ${icon ? 'pl-14' : 'px-6'} pr-6
              text-white font-bold placeholder-[#64748B] 
              focus:outline-none focus:border-[#7C3AED] focus:bg-[#1F2937]
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500/50 focus:border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] font-black uppercase text-red-500 ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
