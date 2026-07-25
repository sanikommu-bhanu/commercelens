import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import Button from '../../components/ui/Button';
import BottomNav from '../../components/ui/BottomNav';
import EmptyState from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/formatters';

export default function Cart() {
  const navigate = useNavigate();
  const { lines, removeLine, setQty, subtotal } = useCartStore();
  const shipping = lines.length ? 9 : 0;
  const total = subtotal() + shipping;

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-display font-semibold text-lg">My Cart</p>
          <span className="text-sm text-brand-accent font-medium w-9 text-right">Edit</span>
        </div>

        {lines.length === 0 ? (
          <EmptyState
            type="cart"
            title="Your cart is empty"
            description="Browse products and add something you love."
            action={<Button onClick={() => navigate('/home')}>Start Shopping</Button>}
          />
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-6">
              {lines.map((line, i) => (
                <motion.div
                  key={`${line.productId}-${line.size}-${line.color}`}
                  drag="x"
                  dragConstraints={{ left: -80, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) removeLine(i);
                  }}
                  className="flex items-center gap-3 bg-white dark:bg-dark-surface rounded-xl3 p-3 shadow-softer"
                >
                  <img src={line.image} className="w-16 h-16 rounded-xl2 object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{line.name}</p>
                    <p className="text-xs text-text-muted mb-1">
                      Size: {line.size} Color: {line.color}
                    </p>
                    <p className="text-sm font-semibold text-brand-accent tabular">{formatCurrency(line.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-cream dark:bg-dark-bg rounded-full px-2 py-1">
                    <button onClick={() => setQty(i, line.qty - 1)} className="w-6 h-6 flex items-center justify-center">
                      <Minus size={13} />
                    </button>
                    <span className="text-sm w-4 text-center tabular">{line.qty}</span>
                    <button onClick={() => setQty(i, line.qty + 1)} className="w-6 h-6 flex items-center justify-center">
                      <Plus size={13} />
                    </button>
                  </div>
                  <button onClick={() => removeLine(i)} className="text-danger">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-xl3 p-4 shadow-softer mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">Subtotal</span>
                <span className="tabular">{formatCurrency(subtotal())}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">Shipping</span>
                <span className="tabular">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between font-display text-lg font-semibold pt-2 border-t border-brand-tan/15">
                <span>Total</span>
                <span className="tabular">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button fullWidth onClick={() => navigate('/checkout')}>
              Checkout
            </Button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
