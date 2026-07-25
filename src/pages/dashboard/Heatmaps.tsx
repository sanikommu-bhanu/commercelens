import { useState } from 'react';
import { ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardBottomNav } from '../../components/ui/DashboardNav';
import { Card, Chip } from '../../components/ui/Card';
import { Skeleton, useSimulatedLoading } from '../../components/ui/Skeleton';

const TABS = ['Heatmaps', 'Reports', 'Sessions'] as const;

const BLOBS = [
  { top: '18%', left: '48%', size: 90, intensity: 0.9 },
  { top: '52%', left: '40%', size: 120, intensity: 0.7 },
  { top: '70%', left: '60%', size: 70, intensity: 0.5 },
  { top: '35%', left: '62%', size: 60, intensity: 0.4 },
];

export default function Heatmaps() {
  const navigate = useNavigate();
  const loading = useSimulatedLoading(500);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Heatmaps');
  const [device, setDevice] = useState<'Mobile' | 'Desktop'>('Mobile');

  return (
    <div className="app-shell">
      <div className="flex-1 px-5 pt-6 pb-28 w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-semibold flex-1">Heatmaps & Reports</h1>
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
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-[380px]" />
            <Skeleton className="h-[130px]" />
          </div>
        ) : (
          <>
            {tab === 'Heatmaps' && (
              <>
                <div className="flex gap-2 mb-4">
                  {(['Mobile', 'Desktop'] as const).map((d) => (
                    <Chip key={d} active={device === d} onClick={() => setDevice(d)}>
                      {d}
                    </Chip>
                  ))}
                </div>

                <Card className="mb-6 overflow-hidden">
                  <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <img
                      src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&h=800&q=80"
                      alt="Product page"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {BLOBS.map((b, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full pointer-events-none mix-blend-multiply"
                        style={{
                          top: b.top,
                          left: b.left,
                          width: b.size,
                          height: b.size,
                          transform: 'translate(-50%, -50%)',
                          background: `radial-gradient(circle, rgba(196,84,74,${b.intensity}) 0%, rgba(224,169,58,${b.intensity * 0.6}) 45%, rgba(76,154,107,0) 75%)`,
                        }}
                      />
                    ))}
                  </div>
                </Card>

                <Card>
                  <p className="font-display font-semibold mb-3">Heatmap Insights</p>
                  <ul className="flex flex-col gap-2 text-sm text-brand-dark dark:text-cream">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                      Most Clicked: Add to Cart Button
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                      Next: Size Selector
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                      Least: Product Description
                    </li>
                  </ul>
                </Card>
              </>
            )}

            {tab === 'Reports' && (
              <Card className="text-center py-10">
                <p className="text-sm text-text-muted mb-4">Build a custom report from your store metrics.</p>
                <button
                  onClick={() => navigate('/dashboard/reports/create')}
                  className="text-brand-accent text-sm font-semibold"
                >
                  Create Report →
                </button>
              </Card>
            )}

            {tab === 'Sessions' && (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">Session #{4821 - i}</p>
                      <p className="text-xs text-text-muted">{2 + i} pages · {(1.2 + i * 0.4).toFixed(1)} min</p>
                    </div>
                    <span className="text-xs text-text-muted">{i + 1}h ago</span>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <DashboardBottomNav />
    </div>
  );
}
