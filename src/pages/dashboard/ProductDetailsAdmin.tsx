import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MoreVertical } from 'lucide-react';
import { getProducts } from '../../lib/seedData';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';
import { useUiStore } from '../../store/ui';

const COLOR_HEX: Record<string, string> = {
  Sand: '#C9A788', Charcoal: '#3D2A1F', Olive: '#6B6B47', Tan: '#C9A788',
  Black: '#1E140D', Cream: '#F7F3EC', Rust: '#B15A34', Navy: '#2B3A50',
};

export default function ProductDetailsAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useMemo(() => getProducts(), []);
  const product = products.find((p) => p.id === id);
  const pushToast = useUiStore((s) => s.pushToast);

  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] || '');
  const [color, setColor] = useState(product?.colors[0] || '');

  if (!product) return <div className="app-shell p-6">Product not found.</div>;

  const stockForVariant =
    product.variantStock.find((v) => v.size === size && v.color === color)?.stock ?? 0;

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Product Details</h1>
        <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="px-5">
        <div className="w-full aspect-square rounded-xl3 overflow-hidden mb-3 bg-warm-white dark:bg-dark-surface">
          <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-2 mb-5">
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

        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-xl font-semibold">{product.name}</h1>
        </div>
        <p className="font-display text-lg font-semibold mb-1 tabular">{formatCurrency(product.price)}</p>
        <div className="flex items-center gap-1 text-sm mb-4">
          <Star size={14} className="fill-star text-star" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-text-muted">({product.reviewCount} reviews)</span>
        </div>

        <p className="text-sm text-text-muted mb-5">{product.description}</p>

        <p className="font-display font-semibold mb-2">Color: {color}</p>
        <div className="flex gap-3 mb-5">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-full border-2 ${c === color ? 'border-brand-accent' : 'border-transparent'}`}
              style={{ backgroundColor: COLOR_HEX[c] || '#ccc' }}
            />
          ))}
        </div>

        <p className="font-display font-semibold mb-2">Size</p>
        <div className="flex flex-wrap gap-2 mb-5">
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

        <p className="text-sm text-text-muted mb-6">
          Stock: <span className={stockForVariant > 0 ? 'text-success font-medium' : 'text-danger font-medium'}>
            {stockForVariant > 0 ? `In Stock (${stockForVariant} available)` : 'Out of stock'}
          </span>
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => pushToast('Inventory updated', 'success')}
          >
            Add to Inventory
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/dashboard/products/${product.id}/analytics`)}>
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
