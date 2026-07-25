import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, LogOut, Package, MapPin, CreditCard, Bell, HelpCircle, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import BottomNav from '../../components/ui/BottomNav';

const ROWS = [
  { icon: Package, label: 'My Orders', path: '/orders' },
  { icon: MapPin, label: 'Shipping Addresses', path: '/addresses' },
  { icon: CreditCard, label: 'Payment Methods', path: '/payment-methods' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logOut } = useAuthStore();

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-display font-semibold text-lg">Profile</p>
          <div className="w-9" />
        </div>

        <div className="flex flex-col items-center mb-8">
          <img src={user?.avatar} className="w-20 h-20 rounded-full object-cover shadow-soft mb-3" />
          <p className="font-display text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-text-muted">{user?.email}</p>
        </div>

        <button
          onClick={() => navigate('/dashboard/overview')}
          className="w-full flex items-center gap-3 bg-brand-accent text-cream rounded-xl3 p-4 mb-4"
        >
          <LayoutDashboard size={18} />
          <span className="flex-1 text-left text-sm font-semibold">Switch to Studio Dashboard</span>
          <ChevronRight size={16} />
        </button>

        <div className="bg-white dark:bg-dark-surface rounded-xl3 shadow-softer divide-y divide-brand-tan/10 mb-6">
          {ROWS.map(({ icon: Icon, label, path }) => (
            <button key={label} onClick={() => navigate(path)} className="w-full flex items-center gap-3 p-4">
              <Icon size={18} className="text-brand-accent" />
              <span className="flex-1 text-left text-sm font-medium">{label}</span>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
          ))}
        </div>

        <button onClick={logOut} className="w-full flex items-center justify-center gap-2 text-danger font-medium py-3">
          <LogOut size={16} /> Log out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
