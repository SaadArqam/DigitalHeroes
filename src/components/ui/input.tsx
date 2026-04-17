'use client';

import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl
            text-slate-900 font-bold placeholder:text-slate-400
            focus:outline-none focus:border-brand-indigo focus:bg-white
            transition-all duration-200
            ${error ? 'border-red-500 bg-red-50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
