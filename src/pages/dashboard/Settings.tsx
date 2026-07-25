import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, Chip } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useUiStore, Theme } from '../../store/ui';
import { resetDemoData } from '../../lib/seedData';

const TABS = ['Preferences', 'Notifications', 'Security'] as const;
const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${checked ? 'bg-brand-accent justify-end' : 'bg-brand-tan/30 justify-start'}`}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow" />
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Preferences');
  const { theme, setTheme, currency, setCurrency, language, setLanguage, pushToast } = useUiStore();
  const [quickInsights, setQuickInsights] = useState(true);
  const [comparisonData, setComparisonData] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshFreq, setRefreshFreq] = useState('Every 30 Minutes');
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    'Low Stock Alerts': true,
    'Sales Milestones': true,
    'Weekly Summary': true,
    'Marketing Tips': false,
  });

  function handleSave() {
    pushToast('Settings saved', 'success');
  }

  function handleReset() {
    resetDemoData();
    pushToast('Demo data has been reset', 'success');
  }

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Settings</h1>
      </div>

      <div className="px-5 flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
            {t}
          </Chip>
        ))}
      </div>

      {tab === 'Preferences' && (
        <div className="px-5 flex flex-col gap-6">
          <div>
            <p className="font-display font-semibold mb-3">Appearance</p>
            <Card className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <div className="flex gap-4">
                {THEMES.map((t) => (
                  <label key={t.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={theme === t.value}
                      onChange={() => setTheme(t.value)}
                      className="accent-brand-accent"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <p className="font-display font-semibold mb-3">Language</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-2xl border border-brand-tan/30 bg-white dark:bg-dark-surface px-4 py-3.5 text-sm outline-none"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>

          <div>
            <p className="font-display font-semibold mb-3">Currency</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-2xl border border-brand-tan/30 bg-white dark:bg-dark-surface px-4 py-3.5 text-sm outline-none"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>

          <div>
            <p className="font-display font-semibold mb-3">Dashboard</p>
            <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10">
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm">Show Quick Insights</span>
                <Toggle checked={quickInsights} onChange={setQuickInsights} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm">Show Comparison Data</span>
                <Toggle checked={comparisonData} onChange={setComparisonData} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm">Auto-Refresh Data</span>
                <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
              </div>
            </Card>
          </div>

          <div>
            <p className="font-display font-semibold mb-3">Data</p>
            <select
              value={refreshFreq}
              onChange={(e) => setRefreshFreq(e.target.value)}
              className="w-full mb-3 rounded-2xl border border-brand-tan/30 bg-white dark:bg-dark-surface px-4 py-3.5 text-sm outline-none"
            >
              <option>Every 15 Minutes</option>
              <option>Every 30 Minutes</option>
              <option>Every Hour</option>
            </select>
            <p className="text-xs text-text-muted mb-2">Data Refresh Frequency</p>
          </div>

          <Button fullWidth onClick={handleSave}>
            Save Changes
          </Button>

          <button
            onClick={handleReset}
            className="w-full text-center text-sm font-semibold text-danger py-2"
          >
            Reset Demo Data
          </button>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="px-5">
          <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10">
            {Object.keys(notifPrefs).map((label) => (
              <div key={label} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm">{label}</span>
                <Toggle
                  checked={notifPrefs[label]}
                  onChange={(v) => setNotifPrefs((prev) => ({ ...prev, [label]: v }))}
                />
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === 'Security' && (
        <div className="px-5 flex flex-col gap-3">
          <Card>
            <p className="text-sm font-medium mb-1">Change Password</p>
            <p className="text-xs text-text-muted">Update your account password regularly to stay secure.</p>
          </Card>
          <Card>
            <p className="text-sm font-medium mb-1">Two-Factor Authentication</p>
            <p className="text-xs text-text-muted">Add an extra layer of security to your account.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
