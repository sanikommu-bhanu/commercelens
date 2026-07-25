import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...rest }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-2xl border bg-white dark:bg-dark-surface px-4 py-3.5 text-brand-dark dark:text-cream placeholder:text-text-muted outline-none transition-colors',
          error ? 'border-danger' : 'border-brand-tan/30 focus:border-brand-accent',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
