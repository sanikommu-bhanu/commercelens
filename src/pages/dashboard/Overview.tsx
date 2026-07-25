import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import StatCard from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import { makeTooltipRenderer } from '../../components/charts/ChartTooltip';
import { useAuthStore } from '../../store/auth';
import { getOrders, getFunnel } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';

const overviewTooltip = makeTooltipRenderer(
  (payload) => [{ label: 'Revenue', value: formatCurrency(payload[0]?.value ?? 0), color: '#7A3B1E' }],
  (label) => String(label)
);

export default function Overview() {
  const user = useAuthStore((s) => s.user);
  const loading = useSimulatedLoading(500);
  const orders = useMemo(() => getOrders(), []);
  const funnel = useMemo(() => getFunnel(), []);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const visitors = funnel.reduce((sum, d) => sum + d.visitors, 0);
  const purchases = funnel.reduce((sum, d) => sum + d.purchase, 0);
  const conversion = visitors ? (purchases / visitors) * 100 : 0;

  const trend = funnel.slice(-30).map((d) => ({ date: d.date.slice(5), revenue: d.purchase * 68 }));

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <p className="text-text-muted text-sm mb-0.5">Welcome back,</p>
        <h1 className="font-display text-2xl font-semibold mb-6">{user?.businessName || 'Élan Studio'}</h1>

        {loading ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 min-w-[45%] h-[76px]" />
              ))}
            </div>
            <Skeleton className="h-[260px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-[68px]" />
              <Skeleton className="h-[68px]" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <StatCard label="Revenue" value={revenue} prefix="$" decimals={0} delta={8.2} />
              <StatCard label="Orders" value={totalOrders} delta={4.1} />
              <StatCard label="Visitors" value={visitors} delta={2.4} />
              <StatCard label="Conversion" value={conversion} suffix="%" decimals={1} delta={0.6} />
            </div>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-4">Revenue Overview — Last 30 Days</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C9A78833" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B7E74' }} interval={5} />
                  <YAxis tick={{ fontSize: 10, fill: '#8B7E74' }} width={36} />
                  <Tooltip content={overviewTooltip} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7A3B1E"
                    strokeWidth={2.5}
                    dot={false}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <p className="font-display font-semibold mb-3">Quick Insights</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card>
                <p className="text-sm font-medium mb-1">Best seller this week</p>
                <p className="text-xs text-text-muted">Linen Shirt – Sand is trending with 42 units sold.</p>
              </Card>
              <Card>
                <p className="text-sm font-medium mb-1">Low stock alert</p>
                <p className="text-xs text-text-muted">8 products are out of stock — check Inventory.</p>
              </Card>
            </div>
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
