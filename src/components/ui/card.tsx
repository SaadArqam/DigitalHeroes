'use client';

import * as React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'dark' | 'outline';
  hover?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true
}: CardProps) {
  const baseStyles = "rounded-[2.5rem] p-8 transition-all duration-300";
  
  const variants = {
    default: "bg-white border border-slate-100 shadow-sm",
    glass: "bg-white/70 backdrop-blur-md border border-white/20 shadow-xl",
    dark: "bg-slate-900 text-white border border-slate-800 shadow-2xl",
    outline: "bg-transparent border-2 border-slate-200",
  };

  const hoverStyles = hover ? "hover:shadow-premium hover:-translate-y-1" : "";

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-2xl font-black uppercase tracking-tight text-slate-900 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-slate-500 font-medium ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>;
}
