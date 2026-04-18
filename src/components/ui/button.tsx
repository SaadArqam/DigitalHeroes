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
    
    const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
    
    const variants = {
      primary: 'bg-[#00FFA3] text-[#05070A] hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] hover:-translate-y-0.5',
      secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
      outline: 'bg-transparent border border-white/10 text-white hover:border-[#00FFA3] hover:text-[#00FFA3]',
      ghost: 'bg-transparent text-[#8B949E] hover:text-white',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[9px] rounded-lg',
      md: 'px-6 py-3.5 text-[10px] rounded-xl',
      lg: 'px-10 py-5 text-[11px] rounded-2xl',
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
