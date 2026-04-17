'use client';

import * as React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'purple' | 'slate' | 'outline';
  size?: 'xs' | 'sm';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'indigo', 
  size = 'sm',
  className = '' 
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-black uppercase tracking-widest rounded-full";
  
  const variants = {
    indigo: "bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20",
    emerald: "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20",
    purple: "bg-brand-purple/10 text-brand-purple border border-brand-purple/20",
    slate: "bg-slate-100 text-slate-600 border border-slate-200",
    outline: "bg-transparent text-slate-500 border border-slate-200",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-3 py-1 text-[11px]",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
