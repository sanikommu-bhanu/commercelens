import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

export default function HeartBurst({
  liked,
  onToggle,
  size = 18,
  className,
}: {
  liked: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}) {
  const [burstKey, setBurstKey] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
    setBurstKey((k) => k + 1);
  };

  const particles = Array.from({ length: 5 });

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'relative w-8 h-8 rounded-full bg-white/90 dark:bg-dark-surface/90 flex items-center justify-center shadow-softer',
        className
      )}
    >
      <motion.div animate={{ scale: liked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
        <Heart
          size={size}
          className={liked ? 'fill-danger text-danger' : 'text-brand-dark dark:text-cream'}
        />
      </motion.div>
      <AnimatePresence>
        {liked &&
          particles.map((_, i) => (
            <motion.span
              key={`${burstKey}-${i}`}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: 0,
                x: Math.cos((i / particles.length) * Math.PI * 2) * 18,
                y: Math.sin((i / particles.length) * Math.PI * 2) * 18,
                scale: 1,
              }}
              transition={{ duration: 0.5 }}
              className="absolute w-1.5 h-1.5 rounded-full bg-danger pointer-events-none"
            />
          ))}
      </AnimatePresence>
    </button>
  );
}
