import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';

const INDUSTRIES = ['Fashion & Apparel', 'Beauty & Cosmetics', 'Home & Living', 'Footwear', 'Accessories'];

export default function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [businessName, setBusinessName] = useState('Élan Studio');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding(businessName, industry);
    navigate('/home');
  };

  return (
    <div className="app-shell flex flex-col px-6 pt-14 pb-10">
      <h1 className="font-display text-3xl font-semibold mb-1">Set up your studio</h1>
      <p className="text-text-muted mb-8">This powers your dashboard profile — you can change it anytime.</p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="text-sm font-medium text-text-muted">Business name</label>
        <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        <label className="text-sm font-medium text-text-muted mt-2">Industry</label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full rounded-2xl border border-brand-tan/30 bg-white dark:bg-dark-surface px-4 py-3.5 outline-none"
        >
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <Button type="submit" fullWidth className="mt-4">
          Continue to CommerceLens
        </Button>
      </form>
    </div>
  );
}
