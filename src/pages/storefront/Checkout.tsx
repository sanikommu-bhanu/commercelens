import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import ProgressSteps from '../../components/ui/ProgressSteps';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';

export default function Checkout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="app-shell px-5 pt-6 pb-8 min-h-screen flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <p className="font-display font-semibold text-lg">Checkout</p>
      </div>

      <div className="mb-6">
        <ProgressSteps steps={['Shipping', 'Payment', 'Review']} current={0} />
      </div>

      <p className="font-display font-semibold mb-3">Shipping Address</p>
      <div className="bg-white dark:bg-dark-surface rounded-xl3 p-4 shadow-softer mb-6 flex items-start gap-3">
        <MapPin size={18} className="text-brand-accent mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium">{user?.name || 'Sophia Lee'}</p>
          <p className="text-sm text-text-muted">123 Fashion Ave, Apt 4B</p>
          <p className="text-sm text-text-muted">New York, NY 10001, USA</p>
          <p className="text-sm text-text-muted">+1 (555) 123-4567</p>
        </div>
        <button className="text-sm text-brand-accent font-medium">Change</button>
      </div>

      <p className="font-display font-semibold mb-3">Shipping Method</p>
      <div className="flex flex-col gap-2 mb-8">
        <label className="flex items-center justify-between bg-white dark:bg-dark-surface rounded-xl3 p-4 shadow-softer">
          <span className="flex items-center gap-2 text-sm">
            <input type="radio" name="ship" defaultChecked className="accent-brand-accent" />
            Standard Shipping (3-5 days)
          </span>
          <span className="text-sm font-semibold text-success">Free</span>
        </label>
        <label className="flex items-center justify-between bg-white dark:bg-dark-surface rounded-xl3 p-4 shadow-softer">
          <span className="flex items-center gap-2 text-sm">
            <input type="radio" name="ship" className="accent-brand-accent" />
            Express Shipping (1-2 days)
          </span>
          <span className="text-sm font-semibold tabular">$12.00</span>
        </label>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/payment')}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
