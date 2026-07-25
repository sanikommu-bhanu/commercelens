import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import BottomNav from '../../components/ui/BottomNav';

export default function SupportChat() {
  const navigate = useNavigate();
  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-10">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-display font-semibold text-lg">Chat</p>
        </div>
        <div className="flex flex-col items-center text-center py-16">
          <MessageCircle size={40} className="text-brand-accent mb-4" />
          <p className="font-display text-lg mb-2">No conversations yet</p>
          <p className="text-text-muted text-sm">Message us any time — we usually reply within a few hours.</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
