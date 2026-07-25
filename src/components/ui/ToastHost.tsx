import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '../../store/ui';
import clsx from 'clsx';

export default function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-shell pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={clsx(
              'mx-auto px-4 py-3 rounded-2xl text-sm font-medium text-center shadow-soft glass text-brand-dark dark:text-cream',
              t.tone === 'success' && 'text-success',
              t.tone === 'error' && 'text-danger'
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
