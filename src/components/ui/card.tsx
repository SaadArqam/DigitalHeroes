'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'outline';
  hoverable?: boolean;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
}: CardProps) {
  const variants = {
    default: "bg-card border-card-border",
    glass: "glass-card",
    outline: "bg-transparent border-2 border-card-border",
  };

  return (
    <motion.div
      whileHover={hoverable ? { y: -5, scale: 1.01 } : {}}
      className={`
        rounded-[2.5rem] border p-8 shadow-premium transition-all duration-300
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <h3 className={`text-2xl font-black text-white tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <p className={`text-sm font-bold text-text-secondary mt-2 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <div className={className}>{children}</div>;
}
