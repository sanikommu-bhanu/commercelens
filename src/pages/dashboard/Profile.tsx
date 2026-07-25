import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';

const TEAM = [
  { id: 't1', name: 'Sophia Lee', role: 'Admin', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 't2', name: 'James Carter', role: 'Analyst', avatar: 'https://i.pravatar.cc/150?img=12' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuthStore();
  const pushToast = useUiStore((s) => s.pushToast);
  const [open, setOpen] = useState(false);
  const [businessName, setBusinessName] = useState(user?.businessName || 'Élan Studio');
  const [industry, setIndustry] = useState(user?.industry || 'Fashion & Apparel');
  const [website, setWebsite] = useState('www.elanstudio.com');

  function handleSave() {
    completeOnboarding(businessName, industry);
    pushToast('Profile updated', 'success');
    setOpen(false);
  }

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Profile</h1>
        <button className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <Share2 size={16} />
        </button>
      </div>

      <div className="px-5 flex flex-col items-center mb-6">
        <img
          src={user?.avatar || 'https://i.pravatar.cc/150?img=47'}
          alt={businessName}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
        <p className="font-display text-lg font-semibold">{businessName}</p>
        <p className="text-xs text-text-muted">{user?.email}</p>
      </div>

      <div className="px-5">
        <p className="font-display font-semibold mb-3">Business Information</p>
        <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10 mb-6">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-text-muted">Business Name</span>
            <span className="text-sm font-medium">{businessName}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-text-muted">Industry</span>
            <span className="text-sm font-medium">{industry}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-text-muted">Website</span>
            <span className="text-sm font-medium">{website}</span>
          </div>
        </Card>

        <p className="font-display font-semibold mb-3">Team Members</p>
        <Card className="p-0 divide-y divide-brand-tan/15 dark:divide-white/10 mb-8">
          {TEAM.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3.5">
              <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover" />
              <span className="text-sm font-medium flex-1">{m.name}</span>
              <span className="text-xs text-text-muted">{m.role}</span>
            </div>
          ))}
        </Card>

        <Button fullWidth onClick={() => setOpen(true)}>
          Edit Profile
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Profile">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium mb-1.5">Business Name</p>
            <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </div>
          <div>
            <p className="text-sm font-medium mb-1.5">Industry</p>
            <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <div>
            <p className="text-sm font-medium mb-1.5">Website</p>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <Button fullWidth onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
