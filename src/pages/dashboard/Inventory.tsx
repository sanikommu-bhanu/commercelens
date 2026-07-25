import { useMemo, useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card, Chip } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import StockDonut from '../../components/charts/StockDonut';
import ForecastChart from '../../components/charts/ForecastChart';
import { getProducts } from '../../lib/seedData';

const TABS = ['Overview', 'Stock', 'Forecast', 'Variants'] as const;

export default function Inventory() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(500);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const products = useMemo(() => getProducts(), []);

  const totalSkus = products.length;
  const outOfStock = products.filter((p) => p.totalStock === 0).length;
  const lowStock = products.filter((p) => p.totalStock > 0 && p.totalStock < 15).length;
  const inStock = totalSkus - outOfStock - lowStock;

  const donutData = [
    { name: 'In Stock', value: inStock, color: '#4C9A6B' },
    { name: 'Low Stock', value: lowStock, color: '#E0A93A' },
    { name: 'Out of Stock', value: outOfStock, color: '#C4544A' },
  ];

  const lowStockItems = useMemo(
    () => [...products].filter((p) => p.totalStock < 15).sort((a, b) => a.totalStock - b.totalStock).slice(0, 6),
    [products]
  );

  const forecastData = Array.from({ length: 8 }).map((_, i) => ({
    label: `W${i + 1}`,
    actual: i < 5 ? 200 + Math.round(Math.sin(i) * 40 + i * 10) : undefined,
    forecast: 200 + Math.round(Math.sin(i) * 40 + i * 10 + (i >= 4 ? (i - 4) * 6 : 0)),
  }));

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Inventory & Forecasting</h1>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <Search size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <SlidersHorizontal size={16} />
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
                <Skeleton key={i} className="flex-1 min-w-[45%] h-[70px]" />
              ))}
            </div>
            <Skeleton className="h-[260px]" />
            <Skeleton className="h-[230px]" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[60px]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Total SKUs</p>
                <p className="text-xl font-display font-semibold tabular">{totalSkus.toLocaleString()}</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Low Stock</p>
                <p className="text-xl font-display font-semibold tabular text-star">{lowStock}</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Out of Stock</p>
                <p className="text-xl font-display font-semibold tabular text-danger">{outOfStock}</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Reorder Soon</p>
                <p className="text-xl font-display font-semibold tabular text-brand-accent">{Math.round(lowStock * 0.7)}</p>
              </Card>
            </div>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-4">Stock Status</p>
              <p className="text-xs text-text-muted mb-3">By Quantity</p>
              <StockDonut data={donutData} centerLabel="SKUs" centerValue={totalSkus} />
              <div className="flex flex-col gap-1.5 mt-4">
                {donutData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-brand-dark dark:text-cream font-medium">{d.name}</span>
                    <span className="text-text-muted ml-auto">
                      {Math.round((d.value / totalSkus) * 100)}% ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-4">Demand Forecast</p>
              <ForecastChart data={forecastData} />
            </Card>

            <p className="font-display font-semibold mb-3">Top Low Stock Items</p>
            <div className="flex flex-col gap-2">
              {lowStockItems.map((p) => (
                <Card key={p.id} className="flex items-center gap-3 py-3">
                  <img src={p.images[0]} alt={p.name} className="w-11 h-11 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-text-muted">Stock: {p.totalStock}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      p.totalStock === 0 ? 'bg-danger/10 text-danger' : 'bg-star/10 text-star'
                    }`}
                  >
                    {p.totalStock === 0 ? 'Out' : 'Low'}
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
