import { ReactNode } from 'react';

export interface ChartTooltipRow {
  label: string;
  value: ReactNode;
  color?: string;
}

/**
 * Shared glass-style tooltip used across RevenueLine, ForecastChart,
 * PriceScatter and StockDonut so every chart in the app feels consistent.
 */
export default function ChartTooltip({
  active,
  title,
  rows,
}: {
  active?: boolean;
  title?: string;
  rows: ChartTooltipRow[];
}) {
  if (!active || rows.length === 0) return null;
  return (
    <div className="glass rounded-xl2 px-3 py-2 shadow-soft min-w-[120px]">
      {title && <p className="text-[10px] font-semibold text-text-muted mb-1">{title}</p>}
      <div className="flex flex-col gap-0.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            {r.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />}
            <span className="text-brand-dark dark:text-cream font-medium">{r.label}</span>
            <span className="text-text-muted ml-auto tabular">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Builds a recharts-compatible tooltip renderer from a row mapper. */
export function makeTooltipRenderer(
  mapRows: (payload: any[], label: any) => ChartTooltipRow[],
  title?: (label: any) => string | undefined
) {
  return ({ active, payload, label }: any) => (
    <ChartTooltip active={active} title={title ? title(label) : undefined} rows={payload ? mapRows(payload, label) : []} />
  );
}
