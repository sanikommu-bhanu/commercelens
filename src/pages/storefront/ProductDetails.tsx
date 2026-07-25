import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { getProducts } from '../../lib/seedData';
import { useWishlistStore } from '../../store/wishlist';
import { useCartStore } from '../../store/cart';
import { useUiStore } from '../../store/ui';
import HeartBurst from '../../components/ui/HeartBurst';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';

const COLOR_HEX: Record<string, string> = {
  Sand: '#C9A788', Charcoal: '#3D2A1F', Olive: '#6B6B47', Tan: '#C9A788',
  Black: '#1E140D', Cream: '#F7F3EC', Rust: '#B15A34', Navy: '#2B3A50',
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useMemo(() => getProducts(), []);
  const product = products.find((p) => p.id === id);
  const { ids, toggle, userId } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const pushToast = useUiStore((s) => s.pushToast);

  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] || '');
  const [color, setColor] = useState(product?.colors[0] || '');
  const [expanded, setExpanded] = useState(false);

  if (!product) return <div className="app-shell p-6">Product not found.</div>;

  const handleAdd = () => {
    if (!userId) return;
    addToCart(product, size, color);
    pushToast('Added to cart', 'success');
  };

  return (
    <div className="app-shell pb-28">
      <div className="relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 && imgIdx < product.images.length - 1) setImgIdx(imgIdx + 1);
            else if (info.offset.x > 50 && imgIdx > 0) setImgIdx(imgIdx - 1);
          }}
          className="w-full h-[420px] overflow-hidden"
        >
          <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-softer"
        >
          <ArrowLeft size={18} />
        </button>
        <HeartBurst liked={ids.includes(product.id)} onToggle={() => userId && toggle(product.id)} className="absolute top-5 right-5" />
        <div className="flex gap-1.5 justify-center mt-3 absolute bottom-3 left-1/2 -translate-x-1/2">
          {product.images.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-brand-accent' : 'bg-white/70'}`} />
          ))}
        </div>
      </div>

      <div className="px-5 -mt-4 relative bg-cream dark:bg-dark-bg rounded-t-xl3 pt-5">
        <div className="flex gap-2 mb-3">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className={`w-14 h-16 rounded-xl2 overflow-hidden border-2 ${i === imgIdx ? 'border-brand-accent' : 'border-transparent'}`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <p className="text-xs text-text-muted mb-1">{product.gender}&apos;s Style</p>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-xl font-semibold">{product.name}</h1>
          <span className="flex items-center gap-1 text-sm font-medium">
            <Star size={14} className="fill-star text-star" /> {product.rating}
          </span>
        </div>

        <p className="font-display font-semibold mb-1">Product Details</p>
        <p className={`text-sm text-text-muted mb-1 ${expanded ? '' : 'line-clamp-2'}`}>{product.description}</p>
        <button onClick={() => setExpanded((v) => !v)} className="text-sm text-brand-accent font-medium mb-4">
          {expanded ? 'Show less' : 'Read more'}
        </button>

        <p className="font-display font-semibold mb-2">Select Size</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-11 h-11 rounded-xl2 flex items-center justify-center text-sm font-medium ${
                s === size ? 'bg-brand-dark text-cream' : 'bg-white dark:bg-dark-surface text-brand-dark dark:text-cream border border-brand-tan/20'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="font-display font-semibold mb-2">Select Color : {color}</p>
        <div className="flex gap-3 mb-6">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-full border-2 ${c === color ? 'border-brand-accent' : 'border-transparent'}`}
              style={{ backgroundColor: COLOR_HEX[c] || '#ccc' }}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-shell mx-auto bg-cream dark:bg-dark-bg border-t border-brand-tan/20 dark:border-white/10 px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-text-muted">Total Price</p>
          <p className="font-display text-lg font-semibold tabular">{formatCurrency(product.price)}</p>
        </div>
        <Button onClick={handleAdd} className="flex-1">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
