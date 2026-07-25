import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Card, Chip } from '../../components/ui/Card';
import RevenueLine from '../../components/charts/RevenueLine';
import { getProducts } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';

const TABS = ['Overview', 'Sales', 'Inventory', 'Behavior'] as const;

export default function ProductAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const products = useMemo(() => getProducts(), []);
  const product = products.find((p) => p.id === id);

  if (!product) return <div className="app-shell p-6">Product not found.</div>;

  const revenue = product.priceHistory.map((pt, i) => ({
    date: `M${i + 1}`,
    value: Math.round(pt.price * (10 + i * 3)),
  }));

  const unitsSold = 248 + (product.id.length * 7) % 60;
  const revenueTotal = product.price * unitsSold;

  const variants = product.variantStock
    .slice()
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 3)
    .map((v) => ({ label: `${v.size} / ${v.color}`, units: Math.max(5, v.stock) }));

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Product Analytics</h1>
        <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="px-5">
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {TABS.map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Chip>
          ))}
        </div>

        <p className="text-xs text-text-muted mb-4">Last 30 Days</p>

        <Card className="mb-6">
          <p className="text-xs text-text-muted mb-1">Revenue</p>
          <p className="text-xl font-display font-semibold tabular mb-3">{formatCurrency(revenueTotal)}</p>
          <RevenueLine data={revenue} valueFormatter={formatCurrency} />
        </Card>

        <div className="flex gap-3 mb-6">
          <Card className="flex-1">
            <p className="text-xs text-text-muted mb-1">Orders</p>
            <p className="text-lg font-display font-semibold tabular">{Math.round(unitsSold / 1.3)}</p>
          </Card>
          <Card className="flex-1">
            <p className="text-xs text-text-muted mb-1">Units Sold</p>
            <p className="text-lg font-display font-semibold tabular">{unitsSold}</p>
          </Card>
        </div>

        <p className="font-display font-semibold mb-3">Top Performing Variants</p>
        <p className="text-xs text-text-muted mb-3">By Sales</p>
        <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10 mb-8">
          {variants.map((v) => (
            <div key={v.label} className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm">{v.label}</span>
              <span className="text-sm font-semibold tabular">{v.units} units</span>
            </div>
          ))}
        </Card>

        <button
          onClick={() => navigate(`/dashboard/products/${product.id}`)}
          className="w-full text-center text-sm font-semibold text-brand-accent"
        >
          View Full Report
        </button>
      </div>
    </div>
  );
}
