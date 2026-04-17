'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon,
}: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1220] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: "bg-primary-gradient text-white shadow-glow hover:scale-[1.02] active:scale-[0.98] focus:ring-primary-start",
    secondary: "bg-card text-white border border-card-border hover:bg-input-bg focus:ring-gray-700",
    outline: "bg-transparent border border-input-border text-white hover:border-gray-400 focus:ring-gray-700",
    ghost: "bg-transparent text-text-secondary hover:text-white hover:bg-white/5",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-2.5",
  };

  return (
    <button
      type={type}
      onClick={!disabled && !isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[variant === 'ghost' && size === 'icon' ? 'icon' : size]} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <div className="flex items-center gap-2 relative z-10 font-black tracking-widest uppercase text-[10px]">
          {icon}
          {children}
        </div>
      )}
    </button>
  );
}
