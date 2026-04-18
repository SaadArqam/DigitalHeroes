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
      <div className="space-y-3 w-full">
        {label && (
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8B949E] ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B949E] group-focus-within:text-[#00FFA3] transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full h-14 bg-[#0D1117] border border-white/5 rounded-xl 
              ${icon ? 'pl-14' : 'px-6'} pr-6
              text-white font-bold placeholder-[#8B949E] 
              focus:outline-none focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3]/50
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
