import { useMemo, useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Chip } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { getProducts } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';
import type { Category } from '../../types/product';

const CATS: (Category | 'All')[] = ['All', 'T-Shirt', 'Pant', 'Dress', 'Jacket', 'Shoes', 'Bag'];

export default function Products() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(450);
  const products = useMemo(() => getProducts(), []);
  const [cat, setCat] = useState<(Category | 'All')>('All');
  const [query, setQuery] = useState('');

  const filtered = products.filter(
    (p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 30);

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Products</h1>
          <button
            onClick={() => navigate('/dashboard/products/new')}
            className="w-9 h-9 rounded-full bg-brand-accent text-cream flex items-center justify-center shadow-softer"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-warm-white dark:bg-dark-surface rounded-2xl px-4 py-3 shadow-softer">
            <Search size={16} className="text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
            />
          </div>
          <button className="w-11 h-11 shrink-0 rounded-2xl bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto">
          {CATS.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/dashboard/products/${p.id}`)}
                  className="text-left bg-warm-white dark:bg-dark-surface rounded-xl2 overflow-hidden shadow-softer"
                >
                  <img src={p.images[0]} alt={p.name} className="w-full aspect-[3/4] object-cover" />
                  <div className="p-2.5">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-xs text-text-muted">{formatCurrency(p.price)}</p>
                  </div>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <EmptyState
                type="search"
                title="No products found"
                description="Try a different category or search term."
              />
            )}
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
