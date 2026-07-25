import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, AlertTriangle, TrendingUp, PackageX, Info } from 'lucide-react';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card, Chip } from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';

const TABS = ['All', 'Inventory', 'Sales', 'System'] as const;

interface AlertItem {
  id: string;
  type: (typeof TABS)[number];
  icon: typeof AlertTriangle;
  tone: 'danger' | 'success' | 'star' | 'muted';
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
}

const ALERTS: AlertItem[] = [
  { id: '1', type: 'Inventory', icon: AlertTriangle, tone: 'star', title: 'Low Stock Alert', subtitle: 'Wool Coat - Charcoal is running low.', time: '2 min ago', unread: true },
  { id: '2', type: 'Sales', icon: TrendingUp, tone: 'success', title: 'Sales Milestone', subtitle: "You've reached 1000+ orders this month!", time: '1 hour ago', unread: true },
  { id: '3', type: 'Inventory', icon: PackageX, tone: 'danger', title: 'Out of Stock Alert', subtitle: 'Silk Dress - Olive is out of stock.', time: '3 hours ago', unread: false },
  { id: '4', type: 'System', icon: Info, tone: 'muted', title: 'System Update', subtitle: 'New features are now available.', time: 'Yesterday', unread: false },
  { id: '5', type: 'Sales', icon: TrendingUp, tone: 'success', title: 'Revenue Spike', subtitle: 'Revenue is up 12% compared to last week.', time: '2 days ago', unread: false },
  { id: '6', type: 'Inventory', icon: AlertTriangle, tone: 'star', title: 'Reorder Suggested', subtitle: 'Linen Shirt - Sand is close to reorder point.', time: '2 days ago', unread: false },
];

const TONE_CLASSES: Record<AlertItem['tone'], string> = {
  danger: 'bg-danger/10 text-danger',
  success: 'bg-success/10 text-success',
  star: 'bg-star/10 text-star',
  muted: 'bg-brand-tan/15 text-text-muted',
};

export default function Alerts() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');

  const filtered = ALERTS.filter((a) => tab === 'All' || a.type === tab);

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Alerts & Notifications</h1>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <Search size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto">
          {TABS.map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Chip>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((a) => {
            const Icon = a.icon;
            return (
              <Card key={a.id} className="flex items-start gap-3 py-3.5 relative">
                <div className={`relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TONE_CLASSES[a.tone]}`}>
                  <Icon size={16} />
                  {a.unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-accent ring-2 ring-white dark:ring-dark-surface" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{a.subtitle}</p>
                </div>
                <span className="text-[10px] text-text-muted whitespace-nowrap">{a.time}</span>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <EmptyState
              type="alerts"
              title="You're all caught up"
              description={`No ${tab === 'All' ? '' : tab.toLowerCase() + ' '}alerts right now — we'll notify you when something needs attention.`}
            />
          )}
        </div>
      </div>
      <DashboardBottomNav />
    </div>
  );
}
