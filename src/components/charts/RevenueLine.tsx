import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { makeTooltipRenderer } from './ChartTooltip';

export interface RevenuePoint {
  date: string;
  value: number;
}

export default function RevenueLine({
  data,
  height = 200,
  color = '#7A3B1E',
  valueFormatter,
  dataKeyLabel = 'date',
}: {
  data: RevenuePoint[];
  height?: number;
  color?: string;
  valueFormatter?: (v: number) => string;
  dataKeyLabel?: string;
}) {
  const gradientId = `revenueFill-${color.replace('#', '')}`;
  const renderTooltip = makeTooltipRenderer(
    (payload) => [
      { label: 'Value', value: valueFormatter ? valueFormatter(payload[0]?.value ?? 0) : payload[0]?.value, color },
    ],
    (label) => String(label)
  );
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#C9A78833" />
        <XAxis dataKey={dataKeyLabel} tick={{ fontSize: 10, fill: '#8B7E74' }} interval={Math.max(0, Math.floor(data.length / 6))} />
        <YAxis tick={{ fontSize: 10, fill: '#8B7E74' }} width={36} />
        <Tooltip content={renderTooltip} cursor={{ stroke: color, strokeOpacity: 0.25, strokeWidth: 1.5 }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
