import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, Banknote } from 'lucide-react';
import ProgressSteps from '../../components/ui/ProgressSteps';
import Button from '../../components/ui/Button';

const METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, sub: 'Visa · Mastercard · Amex' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, sub: '' },
  { id: 'apple', label: 'Apple Pay', icon: Wallet, sub: '' },
  { id: 'google', label: 'Google Pay', icon: Wallet, sub: '' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, sub: '' },
];

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');

  return (
    <div className="app-shell px-5 pt-6 pb-8 min-h-screen flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <p className="font-display font-semibold text-lg">Payment</p>
      </div>

      <div className="mb-6">
        <ProgressSteps steps={['Shipping', 'Payment', 'Review']} current={1} />
      </div>

      <p className="font-display font-semibold mb-3">Payment Method</p>
      <div className="flex flex-col gap-2 mb-8">
        {METHODS.map(({ id, label, icon: Icon, sub }) => (
          <button
            key={id}
            onClick={() => setMethod(id)}
            className={`flex items-center gap-3 rounded-xl3 p-4 shadow-softer text-left ${
              method === id ? 'bg-brand-accent/10 border border-brand-accent' : 'bg-white dark:bg-dark-surface border border-transparent'
            }`}
          >
            <Icon size={20} className="text-brand-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium">{label}</p>
              {sub && <p className="text-xs text-text-muted">{sub}</p>}
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${method === id ? 'border-brand-accent bg-brand-accent' : 'border-brand-tan/40'}`} />
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/review')}>
          Continue to Review
        </Button>
      </div>
    </div>
  );
}
