import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="app-shell min-h-screen flex flex-col pb-28">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white dark:bg-dark-surface shadow-softer flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <p className="font-display font-semibold text-lg">{title}</p>
          <div className="w-9" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-12">
        <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-surface shadow-soft flex items-center justify-center mb-4">
          <span className="text-2xl opacity-50">🚧</span>
        </div>
        <p className="font-display font-semibold text-xl mb-2 text-center">{title}</p>
        <p className="text-text-muted text-center text-sm">
          This screen is currently under construction. Check back later!
        </p>
      </div>
    </div>
  );
}
