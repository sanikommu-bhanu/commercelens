import StockDonut, { DonutSlice } from './StockDonut';

export default function SegmentDonut({
  data,
  centerLabel,
  centerValue,
  size = 140,
  showLegend = true,
}: {
  data: DonutSlice[];
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
  showLegend?: boolean;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="flex items-center gap-4">
      <StockDonut data={data} centerLabel={centerLabel} centerValue={centerValue} size={size} />
      {showLegend && (
        <div className="flex flex-col gap-1.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-brand-dark dark:text-cream font-medium">{d.name}</span>
              <span className="text-text-muted">
                {total ? Math.round((d.value / total) * 100) : 0}% ({d.value.toLocaleString()})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
