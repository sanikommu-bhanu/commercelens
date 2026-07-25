import clsx from 'clsx';

export default function ProgressSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-1.5">
            <div
              className={clsx(
                'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0',
                i <= current ? 'bg-brand-accent text-cream' : 'bg-brand-tan/20 text-text-muted'
              )}
            >
              {i + 1}
            </div>
            <span className={clsx('text-xs font-medium whitespace-nowrap', i <= current ? 'text-brand-dark dark:text-cream' : 'text-text-muted')}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && <div className={clsx('h-px flex-1', i < current ? 'bg-brand-accent' : 'bg-brand-tan/20')} />}
        </div>
      ))}
    </div>
  );
}
