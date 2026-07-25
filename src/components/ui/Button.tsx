import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'md' | 'sm' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'text-cream shadow-soft bg-gradient-to-br from-brand-accent to-brand-dark hover:shadow-lg hover:brightness-110',
    secondary: 'bg-brand-tan/30 text-brand-dark hover:bg-brand-tan/50 dark:bg-white/10 dark:text-cream',
    outline: 'border border-brand-tan/60 text-brand-dark hover:bg-brand-tan/10 dark:text-cream dark:border-white/20',
    ghost: 'text-brand-dark hover:bg-brand-tan/10 dark:text-cream dark:hover:bg-white/5',
  };
  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3.5 text-base',
    lg: 'px-6 py-4 text-base',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={clsx(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}
