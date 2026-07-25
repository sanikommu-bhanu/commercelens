import { useMemo } from 'react';
import { ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import FunnelChart from '../../components/charts/FunnelChart';
import { getFunnel } from '../../lib/seedData';

const CATEGORY_DROPOFF = [
  { name: 'Outerwear', rate: 2.1, count: 1847 },
  { name: 'Tops', rate: 1.6, count: 1340 },
  { name: 'Bottoms', rate: 2.3, count: 1012 },
  { name: 'Accessories', rate: 3.2, count: 842 },
];

export default function Funnel() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(500);
  const funnel = useMemo(() => getFunnel(), []);
  const month = funnel.slice(-30);

  const visitors = month.reduce((s, d) => s + d.visitors, 0);
  const views = month.reduce((s, d) => s + d.views, 0);
  const addToCart = month.reduce((s, d) => s + d.addToCart, 0);
  const checkout = month.reduce((s, d) => s + d.checkout, 0);
  const purchase = month.reduce((s, d) => s + d.purchase, 0);

  const steps = [
    { label: 'Visitors', value: visitors, percent: 100 },
    { label: 'Product Views', value: views, percent: (views / visitors) * 100 },
    { label: 'Add to Cart', value: addToCart, percent: (addToCart / visitors) * 100 },
    { label: 'Checkout', value: checkout, percent: (checkout / visitors) * 100 },
    { label: 'Purchase', value: purchase, percent: (purchase / visitors) * 100 },
  ];

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Sales Funnel Analysis</h1>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <Search size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <MoreVertical size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[52px]" />
            <Skeleton className="h-[230px]" />
            <Skeleton className="h-[200px]" />
          </div>
        ) : visitors === 0 ? (
          <EmptyState
            type="data"
            title="No funnel data yet"
            description="Once shoppers start visiting your store, their journey from visit to purchase will show up here."
          />
        ) : (
          <>
            <Card className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-xs text-text-muted">Last 30 days</span>
            </Card>

            <Card className="mb-6">
              <FunnelChart steps={steps} />
            </Card>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-1">Drop-off Analysis</p>
              <p className="text-xs text-text-muted mb-4">By Category</p>
              <div className="flex flex-col gap-3">
                {CATEGORY_DROPOFF.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="text-sm flex-1">{c.name}</span>
                    <div className="w-24 h-1.5 rounded-full bg-brand-tan/15 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-brand-accent rounded-full" style={{ width: `${c.rate * 20}%` }} />
                    </div>
                    <span className="text-xs text-text-muted w-10 text-right">{c.rate}%</span>
                    <span className="text-xs text-text-muted w-14 text-right tabular">{c.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
