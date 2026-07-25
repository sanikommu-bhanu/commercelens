import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { getProducts } from '../../lib/seedData';
import { useWishlistStore } from '../../store/wishlist';
import { useUiStore } from '../../store/ui';
import HeartBurst from '../../components/ui/HeartBurst';
import BottomNav from '../../components/ui/BottomNav';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';

export default function Wishlist() {
  const navigate = useNavigate();
  const products = useMemo(() => getProducts(), []);
  const { ids, toggle, userId } = useWishlistStore();
  const pushToast = useUiStore((s) => s.pushToast);
  const liked = products.filter((p) => ids.includes(p.id));

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My CommerceLens Wishlist', url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      pushToast('Link copied to clipboard', 'success');
    }
  };

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-display font-semibold text-lg">Wishlist</p>
          <button onClick={share} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <Share2 size={16} />
          </button>
        </div>

        {liked.length === 0 ? (
          <EmptyState
            type="wishlist"
            title="No favorites yet"
            description="Tap the heart on any product to save it here."
            action={
              <Button onClick={() => navigate('/home')} className="!inline-flex" variant="outline">
                Discover Products
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {liked.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="relative rounded-xl3 overflow-hidden bg-white dark:bg-dark-surface shadow-softer text-left"
              >
                <div className="relative">
                  <img src={p.images[0]} alt={p.name} className="w-full h-40 object-cover" />
                  <HeartBurst liked={ids.includes(p.id)} onToggle={() => userId && toggle(p.id)} className="absolute top-2 right-2" />
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
