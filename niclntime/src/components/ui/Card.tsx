'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  id?: string;
}

export function Card({ children, className = '', variant = 'default', id }: CardProps) {
  const baseStyles = 'relative rounded-2xl transition-all duration-300';
  const variants = {
    default:
      'bg-zinc-900/65 border border-zinc-800/90 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]',
    elevated:
      'bg-zinc-900/80 border border-zinc-800 shadow-2xl shadow-black/40 backdrop-blur-md',
    outlined: 'bg-zinc-950/30 border border-zinc-800 hover:border-zinc-700',
    ghost: 'bg-transparent',
  };

  return (
    <div id={id} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`px-5 py-4 sm:px-6 border-b border-zinc-800/80 ${className}`}>{children}</div>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`px-5 py-5 sm:px-6 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`text-lg font-semibold tracking-tight text-zinc-100 ${className}`}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return <p className={`text-sm leading-relaxed text-zinc-400 mt-1 ${className}`}>{children}</p>;
}
