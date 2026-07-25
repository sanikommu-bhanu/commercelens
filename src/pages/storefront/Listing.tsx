import { useMemo, useState, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, SlidersHorizontal, Scale, X, Check, Star } from 'lucide-react';
import { Chip } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import HeartBurst from '../../components/ui/HeartBurst';
import BottomNav from '../../components/ui/BottomNav';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { getProducts } from '../../lib/seedData';
import { useWishlistStore } from '../../store/wishlist';
import { useCartStore } from '../../store/cart';
import { formatCurrency } from '../../lib/formatters';
import type { Category, Product } from '../../types/product';

const MAX_COMPARE = 3;

const TABS = ['All', 'T-Shirt', 'Jacket', 'Dress', 'Shoes', 'Bag'];
const SORTS = ['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low'];

export default function Listing() {
  const { category } = useParams();
  const navigate = useNavigate();
  const loading = useSimulatedLoading(400);
  const products = useMemo(() => getProducts(), []);
  const { ids, toggle, userId } = useWishlistStore();
  const cartCount = useCartStore((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  const [tab, setTab] = useState(category && TABS.includes(category) ? category : 'All');
  const [sort, setSort] = useState('Popular');
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = tab === 'All' ? products : products.filter((p) => p.category === (tab as Category));
    list = [...list];
    if (sort === 'Newest') list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    if (sort === 'Popular') list.sort((a, b) => b.reviewCount - a.reviewCount);
    return list.slice(0, 40);
  }, [products, tab, sort]);

  const compareProducts = useMemo(
    () => compareIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[],
    [compareIds, products]
  );

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setCompareIds([]);
    setCompareOpen(false);
  };

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-display font-semibold text-lg">{tab === 'All' ? 'All Products' : tab}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (compareMode ? exitCompareMode() : setCompareMode(true))}
              className={`relative w-9 h-9 rounded-full shadow-softer flex items-center justify-center transition-colors ${
                compareMode ? 'bg-brand-accent text-cream' : 'bg-white dark:bg-dark-surface'
              }`}
              aria-label="Compare products"
            >
              {compareMode ? <X size={16} /> : <Scale size={16} />}
            </button>
            <button onClick={() => navigate('/cart')} className="relative w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {compareMode && (
          <div className="mb-4 -mt-1">
            <p className="text-xs text-text-muted">
              Select {MAX_COMPARE === compareIds.length ? 'up to' : ''} 2–{MAX_COMPARE} products to compare side by side.
            </p>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-5 px-5 no-scrollbar">
          {TABS.map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-text-muted">{filtered.length} items</span>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-transparent outline-none text-brand-dark dark:text-cream font-medium"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button onClick={() => navigate('/filter')} className="w-9 h-9 rounded-xl2 bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            type="search"
            title="No results found"
            description="Try a different category or adjust your filters to see more products."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setTab('All');
                  setSort('Popular');
                }}
              >
                Reset Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => {
              const selected = compareIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => (compareMode ? toggleCompare(p.id) : navigate(`/product/${p.id}`))}
                  className={`relative rounded-xl3 overflow-hidden bg-white dark:bg-dark-surface shadow-softer text-left transition-all ${
                    compareMode && selected ? 'ring-2 ring-brand-accent' : ''
                  } ${compareMode && !selected && compareIds.length >= MAX_COMPARE ? 'opacity-50' : ''}`}
                >
                  <div className="relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-40 object-cover" />
                    {compareMode ? (
                      <span
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                          selected ? 'bg-brand-accent border-brand-accent text-cream' : 'bg-white/90 border-white text-transparent'
                        }`}
                      >
                        <Check size={13} />
                      </span>
                    ) : (
                      <HeartBurst liked={ids.includes(p.id)} onToggle={() => userId && toggle(p.id)} className="absolute top-2 right-2" />
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-brand-accent tabular">{formatCurrency(p.price)}</p>
                      <span className="text-xs text-star">★ {p.rating}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {compareMode && compareIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[390px] z-40"
          >
            <div className="glass rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {compareProducts.map((p) => (
                  <img key={p.id} src={p.images[0]} className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-dark-surface" />
                ))}
              </div>
              <span className="text-xs text-text-muted flex-1">{compareIds.length} selected</span>
              <Button size="sm" disabled={compareIds.length < 2} onClick={() => setCompareOpen(true)}>
                Compare
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={compareOpen} onClose={() => setCompareOpen(false)} title="Compare Products">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {compareProducts.map((p) => (
            <div key={p.id} className="w-40 shrink-0 bg-cream dark:bg-dark-bg rounded-xl3 overflow-hidden shadow-softer">
              <img src={p.images[0]} alt={p.name} className="w-full h-28 object-cover" />
              <div className="p-3 flex flex-col gap-2">
                <p className="text-sm font-medium leading-snug line-clamp-2">{p.name}</p>
                <Row label="Price" value={formatCurrency(p.price)} strong />
                <Row label="Rating" value={<span className="flex items-center gap-1"><Star size={11} className="fill-star text-star" />{p.rating}</span>} />
                <Row label="Reviews" value={p.reviewCount.toLocaleString()} />
                <Row label="Brand" value={p.brand} />
                <Row label="Stock" value={p.totalStock > 0 ? `${p.totalStock} left` : 'Out of stock'} />
                <Row label="Sizes" value={p.sizes.join(', ')} />
                <Button size="sm" fullWidth onClick={() => navigate(`/product/${p.id}`)}>
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs border-t border-brand-tan/15 dark:border-white/10 pt-2 first:border-0 first:pt-0">
      <span className="text-text-muted shrink-0">{label}</span>
      <span className={`text-right truncate ${strong ? 'font-semibold text-brand-accent' : 'font-medium'}`}>{value}</span>
    </div>
  );
}
