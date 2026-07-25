import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import PriceScatter from '../../components/charts/PriceScatter';
import { getProducts } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';

const COMPETITORS = [
  { name: 'Zara', price: 72.1 },
  { name: 'H&M', price: 68.9 },
  { name: 'Mango', price: 74.5 },
  { name: 'Uniqlo', price: 66.0 },
];

export default function Competitor() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(500);
  const products = useMemo(() => getProducts(), []);

  const scatterData = useMemo(
    () =>
      products.slice(0, 60).map((p) => ({
        name: p.name,
        price: p.price,
        quantity: p.totalStock,
      })),
    [products]
  );

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Competitor Analysis</h1>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <MoreVertical size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[190px]" />
            <Skeleton className="h-[260px]" />
          </div>
        ) : COMPETITORS.length === 0 && scatterData.length === 0 ? (
          <EmptyState
            type="data"
            title="No competitor data yet"
            description="Connect a competitor tracking source to see how your pricing and stock compare in real time."
          />
        ) : (
          <>
            <p className="font-display font-semibold mb-3">Top Competitors</p>
            <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10 mb-6">
              {COMPETITORS.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="text-sm font-semibold tabular">{formatCurrency(c.price)}</span>
                </div>
              ))}
            </Card>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-1">Price Positioning</p>
              <p className="text-xs text-text-muted mb-4">Price vs. Stock Quantity</p>
              {scatterData.length === 0 ? (
                <EmptyState
                  type="data"
                  title="No pricing data"
                  description="Add products to see how your prices position against competitors."
                  className="py-8"
                />
              ) : (
                <PriceScatter data={scatterData} />
              )}
            </Card>

            <button onClick={() => navigate(-1)} className="w-full text-center text-sm font-semibold text-brand-accent">
              View Details
            </button>
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
