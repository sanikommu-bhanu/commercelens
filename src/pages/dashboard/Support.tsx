import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, HelpCircle, FileQuestion, LifeBuoy } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const ENTRIES = [
  { icon: MessageCircle, label: 'Chat with Support' },
  { icon: Mail, label: 'Send an Email' },
  { icon: HelpCircle, label: 'Help Center' },
  { icon: FileQuestion, label: 'Request a Feature' },
];

const CONVERSATIONS = [
  { id: 'c1', title: 'Inventory data mismatch', time: '2h ago', status: 'Open' },
  { id: 'c2', title: 'Report export issue', time: '1d ago', status: 'Open' },
  { id: 'c3', title: 'Billing question', time: '3d ago', status: 'Closed' },
];

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Support</h1>
      </div>

      <div className="px-5">
        <Card className="mb-6 flex flex-col items-center text-center py-8">
          <div className="w-14 h-14 rounded-full bg-brand-accent/10 flex items-center justify-center mb-3">
            <LifeBuoy size={26} className="text-brand-accent" />
          </div>
          <p className="font-display font-semibold mb-1">How can we help you?</p>
          <p className="text-xs text-text-muted">We usually reply within a few hours.</p>
        </Card>

        <div className="flex flex-col gap-2 mb-8">
          {ENTRIES.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => navigate('/support-chat')}
              className="w-full flex items-center gap-3 bg-warm-white dark:bg-dark-surface rounded-xl2 px-4 py-3.5 shadow-softer"
            >
              <Icon size={18} className="text-brand-accent" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        <p className="font-display font-semibold mb-3">Recent Conversations</p>
        <div className="flex flex-col gap-2">
          {CONVERSATIONS.map((c) => (
            <Card key={c.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-xs text-text-muted">{c.time}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  c.status === 'Open' ? 'bg-star/10 text-star' : 'bg-success/10 text-success'
                }`}
              >
                {c.status}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
