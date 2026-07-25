import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, SlidersHorizontal, Bell } from 'lucide-react';
import { Chip } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import BottomNav from '../../components/ui/BottomNav';
import HeartBurst from '../../components/ui/HeartBurst';
import { getProducts } from '../../lib/seedData';
import { useWishlistStore } from '../../store/wishlist';
import type { Category } from '../../types/product';
import { formatCurrency } from '../../lib/formatters';

const CATEGORY_ICONS: Record<Category, string> = {
  'T-Shirt': '👕',
  Pant: '👖',
  Dress: '👗',
  Jacket: '🧥',
  Shoes: '👟',
  Bag: '👜',
};

export default function Home() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(400);
  const products = useMemo(() => getProducts(), []);
  const { ids, toggle, load, userId } = useWishlistStore();
  const [filter, setFilter] = useState('Newest');
  const [seconds, setSeconds] = useState(9176);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const flashProducts = products.slice(0, 8);

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-text-muted flex items-center gap-1">Location</p>
            <p className="text-sm font-semibold flex items-center gap-1">
              <MapPin size={14} className="text-brand-accent" /> New York, USA
            </p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <Bell size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-dark-surface rounded-2xl px-4 py-3 shadow-softer">
            <Search size={18} className="text-text-muted" />
            <input placeholder="Search" className="bg-transparent outline-none text-sm flex-1 placeholder:text-text-muted" />
          </div>
          <button
            onClick={() => navigate('/filter')}
            className="w-11 h-11 rounded-2xl bg-brand-accent text-cream flex items-center justify-center shrink-0"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div
          className="rounded-xl3 p-5 mb-4 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: 'linear-gradient(120deg, rgba(122,59,30,0.65), rgba(30,20,13,0.55)), url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=450&q=80)' }}
        >
          <p className="text-cream font-display text-xl font-semibold mb-1">New Collection</p>
          <p className="text-cream/90 text-sm mb-3">Discount 50% for the first transaction</p>
          <button
            onClick={() => navigate('/listing/All')}
            className="bg-brand-dark text-cream text-sm font-semibold px-4 py-2 rounded-full"
          >
            Shop Now
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: '🚚', label: 'Free Shipping', sub: 'Orders $75+' },
            { icon: '↩️', label: 'Easy Returns', sub: '30-day window' },
            { icon: '🔒', label: 'Secure Pay', sub: 'Encrypted' },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-2xl px-2.5 py-3 text-center border border-white/40 dark:border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.18))',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-lg mb-1">{f.icon}</div>
              <p className="text-[11px] font-semibold leading-tight">{f.label}</p>
              <p className="text-[10px] text-text-muted leading-tight">{f.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-semibold text-lg">Category</p>
          <button onClick={() => navigate('/listing/All')} className="text-sm text-brand-accent font-medium">
            See All
          </button>
        </div>
        <div className="flex justify-between mb-6">
          {(Object.keys(CATEGORY_ICONS) as Category[]).map((cat) => (
            <button key={cat} onClick={() => navigate(`/listing/${cat}`)} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center text-xl">
                {CATEGORY_ICONS[cat]}
              </div>
              <span className="text-[11px] text-text-muted">{cat}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-semibold text-lg">Flash Sale</p>
          <span className="text-xs text-text-muted tabular">
            Closing in : {hh} : {mm} : {ss}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-5 px-5 no-scrollbar">
          {['All', 'Newest', 'Popular', 'Man', 'Women'].map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {flashProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="relative rounded-xl3 overflow-hidden bg-white dark:bg-dark-surface shadow-softer text-left"
              >
                <div className="relative">
                  <img src={p.images[0]} alt={p.name} className="w-full h-40 object-cover" />
                  <HeartBurst
                    liked={ids.includes(p.id)}
                    onToggle={() => userId && toggle(p.id)}
                    className="absolute top-2 right-2"
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-sm font-semibold text-brand-accent tabular">{formatCurrency(p.price)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
