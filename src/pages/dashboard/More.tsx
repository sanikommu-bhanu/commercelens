import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { sidebarItems } from '../../components/ui/DashboardNav';
import { useAuthStore } from '../../store/auth';

export default function More() {
  const navigate = useNavigate();
  const { logOut } = useAuthStore();

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6 mb-5">
        <h1 className="font-display text-lg font-semibold">More</h1>
      </div>

      <div className="px-5">
        <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10 mb-6">
          {sidebarItems.map(({ to, label, icon: Icon }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <Icon size={18} className="text-brand-accent" />
              <span className="text-sm font-medium flex-1">{label}</span>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
          ))}
        </Card>

        <button
          onClick={logOut}
          className="w-full text-center text-sm font-semibold text-danger py-3"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
