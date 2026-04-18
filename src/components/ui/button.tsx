'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, icon, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
    
    const variants = {
      primary: 'bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5',
      secondary: 'bg-[#1F2937] text-white border border-[#374151] hover:bg-[#374151]',
      outline: 'bg-transparent border-2 border-[#374151] text-white hover:border-[#7C3AED] hover:text-[#7C3AED]',
      ghost: 'bg-transparent text-[#94A3B8] hover:text-white hover:bg-white/5',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px] rounded-lg',
      md: 'px-8 py-4 text-xs rounded-xl',
      lg: 'px-12 py-5 text-sm rounded-2xl',
      icon: 'p-3 rounded-xl',
    };

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={isLoading || disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {icon && <span className={children ? 'mr-3' : ''}>{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
