import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export type EmptyIllustration = 'cart' | 'wishlist' | 'search' | 'alerts' | 'customers' | 'orders' | 'data';

function Illustration({ type }: { type: EmptyIllustration }) {
  const stroke = '#C9A788';
  const accent = '#7A3B1E';
  const common = { fill: 'none', stroke, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg width="112" height="112" viewBox="0 0 112 112" className="mx-auto">
      <circle cx="56" cy="56" r="52" fill={`${stroke}14`} />
      {type === 'cart' && (
        <g>
          <path {...common} d="M32 40h48l-5 30a4 4 0 0 1-4 3.4H41a4 4 0 0 1-4-3.4L32 40Z" />
          <path {...common} d="M40 40l6-12h20l6 12" />
          <circle cx="44" cy="82" r="3.4" fill={accent} stroke="none" />
          <circle cx="68" cy="82" r="3.4" fill={accent} stroke="none" />
          <path {...common} d="M46 52v12M56 52v12M66 52v12" opacity="0.5" />
        </g>
      )}
      {type === 'wishlist' && (
        <g>
          <path
            {...common}
            d="M56 78S34 64 34 47.5C34 38 41 32 49 32c4.6 0 8.3 2.2 10.3 5.4M56 78s22-14 22-30.5C78 38 71 32 63 32c-4.6 0-8.3 2.2-10.3 5.4"
          />
          <path {...common} d="M44 45l7 7 14-14" opacity="0.55" />
        </g>
      )}
      {type === 'search' && (
        <g>
          <circle cx="50" cy="48" r="16" {...common} />
          <path {...common} d="M61 59l14 14" />
          <path {...common} d="M42 48h16M50 40v16" opacity="0.45" />
        </g>
      )}
      {type === 'alerts' && (
        <g>
          <path {...common} d="M56 32c-8.8 0-14 6.9-14 15v10l-5 9h38l-5-9V47c0-8.1-5.2-15-14-15Z" />
          <path {...common} d="M50 74a6 6 0 0 0 12 0" />
          <circle cx="72" cy="38" r="3.2" fill={accent} stroke="none" />
        </g>
      )}
      {type === 'customers' && (
        <g>
          <circle cx="46" cy="46" r="10" {...common} />
          <path {...common} d="M28 80c0-11 8-18 18-18s18 7 18 18" />
          <circle cx="70" cy="50" r="7.5" {...common} opacity="0.55" />
          <path {...common} d="M68 66c8.5 0.6 14 6.3 14 15.5" opacity="0.55" />
        </g>
      )}
      {type === 'orders' && (
        <g>
          <path {...common} d="M38 34h36l3 44a4 4 0 0 1-4 4.3H39a4 4 0 0 1-4-4.3l3-44Z" />
          <path {...common} d="M46 34v-2a10 10 0 0 1 20 0v2" />
          <path {...common} d="M44 50h24M44 60h16" opacity="0.5" />
        </g>
      )}
      {type === 'data' && (
        <g>
          <path {...common} d="M32 78V56M46 78V42M60 78V50M74 78V34" />
          <path {...common} d="M28 78h56" opacity="0.5" />
          <circle cx="74" cy="34" r="3" fill={accent} stroke="none" />
        </g>
      )}
    </svg>
  );
}

export default function EmptyState({
  type,
  title,
  description,
  action,
  className,
}: {
  type: EmptyIllustration;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center py-16 px-6 ${className || ''}`}
    >
      <Illustration type={type} />
      <p className="font-display text-lg font-semibold mt-5 mb-1.5">{title}</p>
      <p className="text-text-muted text-sm mb-6 max-w-[240px] mx-auto">{description}</p>
      {action}
    </motion.div>
  );
}
