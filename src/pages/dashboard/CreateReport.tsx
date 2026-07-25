import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressSteps from '../../components/ui/ProgressSteps';

const METRICS = ['Revenue', 'Orders', 'Visitors', 'Conversion Rate', 'Top Categories', 'Customer Segments'];
const FORMATS = ['PDF', 'CSV', 'XLSX'];

export default function CreateReport() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(['Revenue', 'Orders', 'Visitors']);
  const [range, setRange] = useState('Mar 1 - Mar 31, 2026');
  const [format, setFormat] = useState('PDF');

  function toggle(metric: string) {
    setSelected((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]));
  }

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Create Report</h1>
      </div>

      <div className="px-5 mb-6">
        <ProgressSteps steps={['Select Metrics', 'Customize', 'Preview']} current={0} />
      </div>

      <div className="px-5">
        <p className="font-display font-semibold mb-3">Select Metrics</p>
        <Card className="mb-6 divide-y divide-brand-tan/15 dark:divide-white/10 p-0">
          {METRICS.map((m) => (
            <button
              key={m}
              onClick={() => toggle(m)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm">{m}</span>
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  selected.includes(m) ? 'bg-brand-accent border-brand-accent' : 'border-brand-tan/40'
                }`}
              >
                {selected.includes(m) && <Check size={13} className="text-cream" />}
              </span>
            </button>
          ))}
        </Card>

        <p className="font-display font-semibold mb-3">Date Range</p>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full mb-6 rounded-2xl border border-brand-tan/30 bg-white dark:bg-dark-surface px-4 py-3.5 text-sm outline-none"
        >
          <option>Mar 1 - Mar 31, 2026</option>
          <option>Feb 1 - Feb 28, 2026</option>
          <option>Last 90 Days</option>
          <option>Year to Date</option>
        </select>

        <p className="font-display font-semibold mb-3">Format</p>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full mb-8 rounded-2xl border border-brand-tan/30 bg-white dark:bg-dark-surface px-4 py-3.5 text-sm outline-none"
        >
          {FORMATS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <Button
          fullWidth
          disabled={selected.length === 0}
          onClick={() =>
            navigate('/dashboard/reports/preview', { state: { metrics: selected, range, format } })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
