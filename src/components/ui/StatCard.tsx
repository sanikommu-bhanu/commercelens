import { useEffect, useState } from 'react';
import { Card } from './Card';
import clsx from 'clsx';

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  delta,
  className,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  className?: string;
}) {
  const animated = useCountUp(value);
  return (
    <Card className={clsx('flex-1 min-w-[45%]', className)}>
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-xl font-display font-semibold tabular text-brand-dark dark:text-cream">
        {prefix}
        {animated.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
        {suffix}
      </p>
      {delta !== undefined && (
        <p className={clsx('text-xs mt-1 font-medium', delta >= 0 ? 'text-success' : 'text-danger')}>
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)}%
        </p>
      )}
    </Card>
  );
}
