import { motion } from 'framer-motion';

export interface FunnelStep {
  label: string;
  value: number;
  percent: number;
}

const COLORS = ['#7A3B1E', '#8F4A26', '#A5602F', '#C9A788'];

export default function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  const max = steps[0]?.value || 1;
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, i) => {
        const widthPct = Math.max(12, (step.value / max) * 100);
        return (
          <div key={step.label} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs text-text-muted">{step.label}</div>
            <div className="flex-1 h-8 bg-brand-tan/10 dark:bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                className="h-full rounded-lg flex items-center px-3"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              >
                <span className="text-cream text-xs font-semibold tabular whitespace-nowrap">
                  {step.value.toLocaleString()}
                </span>
              </motion.div>
            </div>
            <div className="w-12 shrink-0 text-right text-xs font-medium text-text-muted">{step.percent.toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
}
