import { useMemo } from 'react';
import { ArrowLeft, MoreVertical, Download } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RevenueLine from '../../components/charts/RevenueLine';
import { getFunnel, getOrders } from '../../lib/seedData';
import { formatCurrency } from '../../lib/formatters';
import { useUiStore } from '../../store/ui';

export default function ReportPreview() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { metrics?: string[]; range?: string; format?: string } };
  const range = location.state?.range || 'Mar 1 - Mar 31, 2026';
  const pushToast = useUiStore((s) => s.pushToast);

  const orders = useMemo(() => getOrders(), []);
  const funnel = useMemo(() => getFunnel(), []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const visitors = funnel.reduce((s, d) => s + d.visitors, 0);
  const purchases = funnel.reduce((s, d) => s + d.purchase, 0);
  const conversion = visitors ? (purchases / visitors) * 100 : 0;

  const trend = funnel.slice(-30).map((d) => ({ date: d.date.slice(5), value: d.purchase * 68 }));

  const categories = [
    { name: 'Dress', pct: 32 },
    { name: 'T-Shirt', pct: 24 },
    { name: 'Jacket', pct: 18 },
  ];

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Report Preview</h1>
        <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="px-5">
        <p className="font-display text-lg font-semibold mb-0.5">Sales Performance Report</p>
        <p className="text-xs text-text-muted mb-5">{range}</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <Card className="flex-1 min-w-[28%]">
            <p className="text-xs text-text-muted mb-1">Revenue</p>
            <p className="text-lg font-display font-semibold tabular">{formatCurrency(revenue)}</p>
            <p className="text-xs text-success mt-1">+8.2%</p>
          </Card>
          <Card className="flex-1 min-w-[28%]">
            <p className="text-xs text-text-muted mb-1">Orders</p>
            <p className="text-lg font-display font-semibold tabular">{totalOrders.toLocaleString()}</p>
            <p className="text-xs text-success mt-1">+4.1%</p>
          </Card>
          <Card className="flex-1 min-w-[28%]">
            <p className="text-xs text-text-muted mb-1">Conversion Rate</p>
            <p className="text-lg font-display font-semibold tabular">{conversion.toFixed(2)}%</p>
            <p className="text-xs text-success mt-1">+0.6%</p>
          </Card>
        </div>

        <Card className="mb-6">
          <p className="font-display font-semibold mb-4">Revenue Overview</p>
          <p className="text-xs text-text-muted mb-2">This Month</p>
          <RevenueLine data={trend} valueFormatter={formatCurrency} />
        </Card>

        <Card className="mb-8">
          <p className="font-display font-semibold mb-4">Top Categories By Revenue</p>
          <div className="flex items-center gap-2">
            {categories.map((c, i) => (
              <div key={c.name} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-cream text-xs font-semibold"
                  style={{ backgroundColor: ['#7A3B1E', '#A5602F', '#C9A788'][i] }}
                >
                  {c.pct}%
                </div>
                <span className="text-[10px] text-text-muted">{c.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Button fullWidth onClick={() => pushToast('Report downloaded as PDF', 'success')}>
          <Download size={16} /> Download PDF
        </Button>
      </div>
    </div>
  );
}
