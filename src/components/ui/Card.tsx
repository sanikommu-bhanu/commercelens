import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={clsx('bg-warm-white dark:bg-dark-surface rounded-xl3 shadow-soft p-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'bg-brand-accent text-cream'
          : 'bg-brand-tan/15 text-brand-dark dark:text-cream dark:bg-white/10'
      )}
    >
      {children}
    </button>
  );
}
