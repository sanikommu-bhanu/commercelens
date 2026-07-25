import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProgressSteps from '../../components/ui/ProgressSteps';
import Button from '../../components/ui/Button';
import { useCartStore } from '../../store/cart';
import { useUiStore } from '../../store/ui';
import { formatCurrency } from '../../lib/formatters';

export default function Review() {
  const navigate = useNavigate();
  const { lines, subtotal, clear } = useCartStore();
  const pushToast = useUiStore((s) => s.pushToast);
  const [placed, setPlaced] = useState(false);
  const shipping = 9;

  const placeOrder = () => {
    setPlaced(true);
    clear();
    pushToast('Order placed successfully', 'success');
  };

  if (placed) {
    return (
      <div className="app-shell px-6 pt-24 pb-8 flex flex-col items-center text-center min-h-screen relative overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#7A3B1E', '#C9A788', '#4C9A6B', '#E0A93A'][i % 4],
              left: `${10 + ((i * 37) % 80)}%`,
              top: '18%',
            }}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: [0, 90 + (i % 3) * 20], scale: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          <CheckCircle2 size={64} className="text-success mb-5" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display text-2xl font-semibold mb-2"
        >
          Order Confirmed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-text-muted mb-8"
        >
          Your order is on its way. You&apos;ll get a notification when it ships.
        </motion.p>
        <Button fullWidth onClick={() => navigate('/home')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="app-shell px-5 pt-6 pb-8 min-h-screen flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <p className="font-display font-semibold text-lg">Review Order</p>
      </div>

      <div className="mb-6">
        <ProgressSteps steps={['Shipping', 'Payment', 'Review']} current={2} />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center gap-3 bg-white dark:bg-dark-surface rounded-xl3 p-3 shadow-softer">
            <img src={l.image} className="w-14 h-14 rounded-xl2 object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{l.name}</p>
              <p className="text-xs text-text-muted">
                Qty {l.qty} · {l.size} · {l.color}
              </p>
            </div>
            <p className="text-sm font-semibold tabular">{formatCurrency(l.price * l.qty)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-xl3 p-4 shadow-softer mb-8">
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
          <span className="tabular">{formatCurrency(subtotal() + shipping)}</span>
        </div>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={placeOrder}>
          Place Order
        </Button>
      </div>
    </div>
  );
}
