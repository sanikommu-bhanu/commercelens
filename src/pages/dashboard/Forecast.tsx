import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import ForecastChart from '../../components/charts/ForecastChart';
import { getProducts } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';

export default function Forecast() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(500);
  const products = useMemo(() => getProducts(), []);

  const forecastData = Array.from({ length: 12 }).map((_, i) => {
    const month = new Date(2026, i, 1).toLocaleString('en-US', { month: 'short' });
    const base = 40000 + Math.sin(i / 2) * 15000 + i * 800;
    return {
      label: month,
      actual: i < 6 ? Math.round(base) : undefined,
      forecast: Math.round(base * (1 + (i >= 6 ? 0.05 : 0))),
    };
  });

  const forecastedRevenue = 256430;

  const topForecasted = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.totalStock - a.totalStock)
        .slice(0, 3)
        .map((p, i) => ({ ...p, demand: i === 0 ? 'High Demand' : 'High Demand' })),
    [products]
  );

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Seasonal Forecast</h1>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <MoreVertical size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[90px]" />
            <Skeleton className="h-[260px]" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[66px]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <Card className="mb-6">
              <p className="text-xs text-text-muted mb-1">Winter 2026 Forecast</p>
              <p className="text-2xl font-display font-semibold tabular mb-1">{formatCurrency(forecastedRevenue)}</p>
              <p className="text-xs text-success">+9.4% vs last year</p>
            </Card>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-1">Demand Forecast</p>
              <ForecastChart data={forecastData} height={220} />
            </Card>

            <p className="font-display font-semibold mb-3">Top Forecasted Products</p>
            <div className="flex flex-col gap-2">
              {topForecasted.map((p) => (
                <Card key={p.id} className="flex items-center gap-3 py-3">
                  <img src={p.images[0]} alt={p.name} className="w-11 h-11 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-success/10 text-success">
                    High Demand
                  </span>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
