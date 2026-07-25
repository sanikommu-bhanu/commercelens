import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { TrendingUp, PackageSearch } from 'lucide-react';
import Logo from '../../components/ui/Logo';

const AUTO_ADVANCE_MS = 2500;
const SCREEN_COUNT = 3;

export default function Splash() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(SCREEN_COUNT - 1, i)));
  };

  useEffect(() => {
    if (paused || leaving) return;
    timerRef.current = setTimeout(() => {
      if (index < SCREEN_COUNT - 1) {
        goTo(index + 1);
      }
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, leaving]);

  const finish = (to: string) => {
    setLeaving(true);
    setTimeout(() => navigate(to), 420);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setPaused(false);
    const threshold = 40;
    if (info.offset.x < -threshold) goTo(index + 1);
    else if (info.offset.x > threshold) goTo(index - 1);
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - left;
    if (tapX < width / 2) {
      if (index === 0) return;
      goTo(index - 1);
    } else {
      if (index === SCREEN_COUNT - 1) return;
      goTo(index + 1);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-dark">
      <AnimatePresence>
        {leaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-brand-dark"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.94, 1, 0.94] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Logo variant="mark" size={44} tone="dark" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setPaused(true)}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        className="relative min-h-screen w-full cursor-pointer touch-pan-y"
      >
        <AnimatePresence mode="wait">
          {index === 0 && <ScreenBrand key="s0" />}
          {index === 1 && <ScreenAnalytics key="s1" />}
          {index === 2 && <ScreenForecast key="s2" onGetStarted={() => finish('/signup')} onSignIn={() => finish('/signin')} />}
        </AnimatePresence>
      </motion.div>

      {/* Skip control */}
      {index < SCREEN_COUNT - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            finish('/signin');
          }}
          className="absolute z-20 text-sm font-medium text-cream/70 hover:text-cream"
          style={{
            top: 'calc(env(safe-area-inset-top) + 20px)',
            right: '24px',
          }}
        >
          Skip
        </button>
      )}

      {/* Dot indicators */}
      <div
        className="absolute left-0 right-0 z-20 flex items-center justify-center gap-1.5"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? 'w-5 bg-cream' : 'w-1.5 bg-cream/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const heroBg =
  'linear-gradient(180deg, rgba(30,20,13,0.15) 0%, rgba(30,20,13,0.8) 100%), url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=1600&q=80)';

const analyticsBg =
  'linear-gradient(180deg, rgba(30,20,13,0.55) 0%, rgba(30,20,13,0.92) 65%), url(https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=1600&q=80)';

const forecastBg =
  'linear-gradient(180deg, rgba(30,20,13,0.55) 0%, rgba(30,20,13,0.92) 65%), url(https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&h=1600&q=80)';

function ScreenBrand() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex flex-col justify-between text-cream"
      style={{
        backgroundImage: heroBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 64px)' }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-soft mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(247,243,236,0.18), rgba(247,243,236,0.02))',
            border: '1px solid rgba(247,243,236,0.5)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Logo variant="mark" size={32} tone="dark" />
        </motion.div>
        <p className="font-display text-lg tracking-wide">CommerceLens</p>
        <p className="text-xs text-cream/60 mt-1">E-commerce Analytics SaaS</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center px-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 76px)' }}
      >
        <p className="font-display text-2xl leading-snug">
          See More.
          <br />
          Sell Smarter.
        </p>
      </motion.div>
    </motion.div>
  );
}

function ScreenAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex flex-col justify-between text-cream"
      style={{
        backgroundImage: analyticsBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8">


        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-center"
        >
          <p className="font-display text-2xl leading-snug mb-2">Real-Time Analytics</p>
          <p className="text-sm text-cream/70 max-w-[280px]">
            Watch revenue, orders, and conversion move live — no waiting for end-of-day reports.
          </p>
        </motion.div>
      </div>
      <div style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 76px)' }} />
    </motion.div>
  );
}

function ScreenForecast({ onGetStarted, onSignIn }: { onGetStarted: () => void; onSignIn: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex flex-col justify-between text-cream"
      style={{
        backgroundImage: forecastBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8">


        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-center mb-8"
        >
          <p className="font-display text-2xl leading-snug mb-2">Smarter Inventory</p>
          <p className="text-sm text-cream/70 max-w-[280px]">
            Demand forecasting flags low stock and slow movers before they cost you sales.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-8 flex flex-col gap-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGetStarted();
          }}
          className="min-h-[48px] w-full rounded-2xl font-body font-semibold text-base text-cream shadow-soft bg-gradient-to-br from-brand-accent to-brand-dark border border-cream/10 active:scale-[0.97] transition-transform"
        >
          Get Started
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSignIn();
          }}
          className="min-h-[48px] w-full rounded-2xl font-body font-semibold text-base text-cream border border-cream/30 active:scale-[0.97] transition-transform"
        >
          I have an account
        </button>
      </motion.div>
    </motion.div>
  );
}
