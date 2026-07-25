import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { makeTooltipRenderer } from './ChartTooltip';

export interface ForecastPoint {
  label: string;
  actual?: number;
  forecast?: number;
}

export default function ForecastChart({ data, height = 200 }: { data: ForecastPoint[]; height?: number }) {
  const renderTooltip = makeTooltipRenderer(
    (payload) =>
      payload
        .filter((p: any) => p.value !== undefined && p.value !== null)
        .map((p: any) => ({ label: p.name, value: p.value.toLocaleString(), color: p.color })),
    (label) => String(label)
  );
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A788" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#C9A788" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#C9A78833" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8B7E74' }} />
        <YAxis tick={{ fontSize: 10, fill: '#8B7E74' }} width={36} />
        <Tooltip content={renderTooltip} cursor={{ stroke: '#C9A788', strokeOpacity: 0.3, strokeWidth: 1.5 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#C9A788" strokeWidth={2} strokeDasharray="4 3" fill="url(#forecastFill)" />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="#7A3B1E" strokeWidth={2.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
