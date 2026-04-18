import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid';
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-[#0D1117]/80 backdrop-blur-xl border-white/10 shadow-2xl',
    glass: 'bg-white/[0.02] backdrop-blur-2xl border-white/10 shadow-2xl',
    solid: 'bg-[#0D1117] border-white/5',
  };

  return (
    <div 
      className={`rounded-2xl border ${variants[variant]} ${className} overflow-hidden transition-all duration-300`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pb-2 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-xl font-black text-white tracking-tight leading-none ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-[10px] font-black uppercase tracking-widest text-[#8B949E] ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-4 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-0 flex items-center ${className}`} {...props} />;
}
