import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis } from 'recharts';
import ChartTooltip from './ChartTooltip';

export interface ScatterPoint {
  name: string;
  price: number;
  quantity: number;
}

export default function PriceScatter({ data, height = 200 }: { data: ScatterPoint[]; height?: number }) {
  const renderTooltip = ({ active, payload }: any) => {
    const point = payload?.[0]?.payload as ScatterPoint | undefined;
    return (
      <ChartTooltip
        active={active}
        title={point?.name}
        rows={
          point
            ? [
                { label: 'Price', value: `$${point.price}`, color: '#7A3B1E' },
                { label: 'Qty', value: point.quantity, color: '#C9A788' },
              ]
            : []
        }
      />
    );
  };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#C9A78833" />
        <XAxis type="number" dataKey="price" name="Price" unit="$" tick={{ fontSize: 10, fill: '#8B7E74' }} />
        <YAxis type="number" dataKey="quantity" name="Qty" tick={{ fontSize: 10, fill: '#8B7E74' }} width={36} />
        <ZAxis range={[60, 60]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderTooltip} />
        <Scatter data={data} fill="#7A3B1E" animationDuration={700} animationEasing="ease-out" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
