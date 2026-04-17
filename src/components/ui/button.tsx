'use client';

import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

export function Button({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  loading, 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg",
    secondary: "bg-brand-indigo text-white hover:bg-indigo-500 shadow-indigo",
    outline: "bg-transparent border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    emerald: "bg-brand-emerald text-white hover:bg-emerald-600 shadow-lg",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
