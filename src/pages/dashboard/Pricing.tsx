import { useMemo, useState } from 'react';
import { ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card, Chip } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import { makeTooltipRenderer } from '../../components/charts/ChartTooltip';
import { getProducts } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';

const TABS = ['Overview', 'Pricing', 'Competitors', 'Discounts'] as const;

const DISCOUNTS = [
  { label: '20% Off Winter Sale', pct: 15.2 },
  { label: 'Buy 2 Get 1', pct: 12.8 },
  { label: 'Free Shipping', pct: 8.4 },
];

const pricingTooltip = makeTooltipRenderer(
  (payload) => [
    { label: 'Our Price', value: formatCurrency(payload.find((p: any) => p.dataKey === 'ours')?.value ?? 0), color: '#7A3B1E' },
    { label: 'Competitor Avg', value: formatCurrency(payload.find((p: any) => p.dataKey === 'competitor')?.value ?? 0), color: '#C9A788' },
  ],
  (label) => String(label)
);

export default function Pricing() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(500);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const products = useMemo(() => getProducts(), []);

  const avgPrice = products.reduce((s, p) => s + p.price, 0) / products.length;
  const avgCompetitor = products.reduce((s, p) => s + p.competitorPrice, 0) / products.length;

  const byCategory = useMemo(() => {
    const map = new Map<string, { ours: number[]; comp: number[] }>();
    products.forEach((p) => {
      const e = map.get(p.category) || { ours: [], comp: [] };
      e.ours.push(p.price);
      e.comp.push(p.competitorPrice);
      map.set(p.category, e);
    });
    return Array.from(map.entries()).map(([category, v]) => ({
      category,
      ours: Math.round(v.ours.reduce((a, b) => a + b, 0) / v.ours.length),
      competitor: Math.round(v.comp.reduce((a, b) => a + b, 0) / v.comp.length),
    }));
  }, [products]);

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Pricing Dashboard</h1>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <Search size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto">
          {TABS.map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Chip>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 min-w-[45%] h-[68px]" />
              ))}
            </div>
            <Skeleton className="h-[260px]" />
            <Skeleton className="h-[140px]" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Avg. Price</p>
                <p className="text-xl font-display font-semibold tabular">{formatCurrency(avgPrice)}</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Price Elasticity</p>
                <p className="text-xl font-display font-semibold tabular text-danger">-1.23</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Markdown Effectiveness</p>
                <p className="text-xl font-display font-semibold tabular">12.6%</p>
                <p className="text-xs text-success mt-1">+5.2%</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Competitor Avg. Price</p>
                <p className="text-xl font-display font-semibold tabular">{formatCurrency(avgCompetitor)}</p>
              </Card>
            </div>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-1">Price vs. Competitors</p>
              <p className="text-xs text-text-muted mb-4">By Category</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byCategory} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C9A78833" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8B7E74' }} />
                  <YAxis type="category" dataKey="category" width={70} tick={{ fontSize: 10, fill: '#8B7E74' }} />
                  <Tooltip content={pricingTooltip} cursor={{ fill: '#C9A78814' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="ours" name="Our Price" fill="#7A3B1E" radius={[0, 6, 6, 0]} barSize={10} />
                  <Bar dataKey="competitor" name="Competitor Avg" fill="#C9A788" radius={[0, 6, 6, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <p className="font-display font-semibold mb-3">Best Performing Discounts</p>
            <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10">
              {DISCOUNTS.map((d) => (
                <div key={d.label} className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm">{d.label}</span>
                  <span className="text-sm font-semibold text-success">{d.pct}%</span>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
