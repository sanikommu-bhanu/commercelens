import { useMemo, useState } from 'react';
import { ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card, Chip } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import SegmentDonut from '../../components/charts/SegmentDonut';
import { getCustomers, getOrders } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';

const TABS = ['Overview', 'Segments', 'Behavior', 'LTV'] as const;
const SEGMENT_COLORS: Record<string, string> = {
  VIP: '#E0A93A',
  Repeat: '#4C9A6B',
  'One-time': '#C9A788',
  'At-risk': '#C4544A',
};

export default function Customers() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(500);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const customers = useMemo(() => getCustomers(), []);
  const orders = useMemo(() => getOrders(), []);

  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.orderCount > 1).length;
  const avgOrderValue = orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0;
  const avgLtv = customers.length ? customers.reduce((s, c) => s + c.ltv, 0) / customers.length : 0;

  const segmentCounts = ['VIP', 'Repeat', 'One-time', 'At-risk'].map((seg) => ({
    name: seg,
    value: customers.filter((c) => c.segment === seg).length,
    color: SEGMENT_COLORS[seg],
  }));

  const topCustomers = useMemo(
    () => [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5),
    [customers]
  );

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Customer Analytics</h1>
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

        {loading ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 min-w-[45%] h-[76px]" />
              ))}
            </div>
            <Skeleton className="h-[160px]" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[60px]" />
              ))}
            </div>
          </div>
        ) : totalCustomers === 0 ? (
          <EmptyState
            type="customers"
            title="No customers yet"
            description="Once shoppers create accounts and place orders, they'll show up here with segments and lifetime value."
          />
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Total Customers</p>
                <p className="text-xl font-display font-semibold tabular">{totalCustomers.toLocaleString()}</p>
                <p className="text-xs text-success mt-1">+3.2%</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Repeat Customers</p>
                <p className="text-xl font-display font-semibold tabular">{repeatCustomers.toLocaleString()}</p>
                <p className="text-xs text-success mt-1">+6.7%</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Avg. Order Value</p>
                <p className="text-xl font-display font-semibold tabular">{formatCurrency(avgOrderValue)}</p>
                <p className="text-xs text-success mt-1">+4.4%</p>
              </Card>
              <Card className="flex-1 min-w-[45%]">
                <p className="text-xs text-text-muted mb-1">Customer Lifetime Value</p>
                <p className="text-xl font-display font-semibold tabular">{formatCurrency(avgLtv)}</p>
                <p className="text-xs text-success mt-1">+9.2%</p>
              </Card>
            </div>

            <Card className="mb-6">
              <p className="font-display font-semibold mb-1">Customer Segments</p>
              <p className="text-xs text-text-muted mb-4">By Percentage</p>
              <SegmentDonut data={segmentCounts} centerLabel="Customers" centerValue={totalCustomers.toLocaleString()} />
            </Card>

            <p className="font-display font-semibold mb-3">Top Customers</p>
            <div className="flex flex-col gap-2">
              {topCustomers.map((c) => (
                <Card key={c.id} className="flex items-center gap-3 py-3">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-text-muted">{formatCurrency(c.totalSpent)}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${SEGMENT_COLORS[c.segment]}20`, color: SEGMENT_COLORS[c.segment] }}
                  >
                    {c.segment}
                  </span>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
