import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid';
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-[#151B2A] border-[#1F2937]',
    glass: 'bg-[#151B2A]/60 backdrop-blur-xl border-white/5 shadow-2xl',
    solid: 'bg-[#0B1220] border-[#1F2937]',
  };

  return (
    <div 
      className={`rounded-[2.5rem] border ${variants[variant]} ${className} overflow-hidden`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-8 pb-4 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-2xl font-black text-white tracking-tight ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm font-bold text-[#94A3B8] ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-8 pt-4 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-8 pt-0 flex items-center ${className}`} {...props} />;
}
