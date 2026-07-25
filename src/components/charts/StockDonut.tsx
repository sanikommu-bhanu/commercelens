import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ChartTooltip from './ChartTooltip';

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

export default function StockDonut({
  data,
  centerLabel,
  centerValue,
  size = 140,
}: {
  data: DonutSlice[];
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
}) {
  const renderTooltip = ({ active, payload }: any) => {
    const slice = payload?.[0]?.payload as DonutSlice | undefined;
    return (
      <ChartTooltip
        active={active}
        rows={slice ? [{ label: slice.name, value: slice.value.toLocaleString(), color: slice.color }] : []}
      />
    );
  };
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={2}
            stroke="none"
            animationDuration={700}
            animationEasing="ease-out"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue !== undefined) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue !== undefined && (
            <p className="font-display font-semibold text-lg text-brand-dark dark:text-cream tabular">{centerValue}</p>
          )}
          {centerLabel && <p className="text-[10px] text-text-muted">{centerLabel}</p>}
        </div>
      )}
    </div>
  );
}
