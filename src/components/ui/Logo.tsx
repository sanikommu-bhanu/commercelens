interface LogoProps {
  /** 'mark' = glyph only. 'lockup' = glyph + wordmark. */
  variant?: 'mark' | 'lockup';
  /** Pixel size of the glyph. Wordmark type scales relative to this. */
  size?: number;
  /** 'dark' = for use on dark/hero backgrounds (cream glyph). 'light' = for use on cream/white backgrounds (brand-dark glyph). */
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * CommerceLens logomark: a magnifying lens whose glass contains a small
 * ascending bar-chart, reading simultaneously as "analytics" and
 * "retail insight" (looking closely at your storefront data).
 */
export default function Logo({ variant = 'mark', size = 40, tone = 'dark', className = '' }: LogoProps) {
  const isDark = tone === 'dark';
  // On dark backgrounds the glyph is rendered in cream tones.
  // On light/cream backgrounds it's rendered in brand-dark/brand-accent tones.
  const ringColor = isDark ? '#F7F3EC' : '#3D2A1F';
  const glassFill = isDark ? 'rgba(247,243,236,0.12)' : 'rgba(122,59,30,0.08)';
  const barColor = isDark ? '#F7F3EC' : '#7A3B1E';
  const handleColor = isDark ? '#F7F3EC' : '#3D2A1F';

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CommerceLens"
    >
      {/* lens handle */}
      <line x1="27.5" y1="27.5" x2="35" y2="35" stroke={handleColor} strokeWidth="3" strokeLinecap="round" />
      {/* lens ring */}
      <circle cx="17.5" cy="17.5" r="13.5" fill={glassFill} stroke={ringColor} strokeWidth="2.5" />
      {/* ascending bar chart inside the glass */}
      <rect x="11" y="18" width="2.6" height="6.5" rx="1" fill={barColor} />
      <rect x="15.7" y="14.5" width="2.6" height="10" rx="1" fill={barColor} />
      <rect x="20.4" y="10.5" width="2.6" height="14" rx="1" fill={barColor} />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={className}>{mark}</div>;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {mark}
      <span
        className="font-display font-semibold leading-none"
        style={{ fontSize: size * 0.5, color: isDark ? '#F7F3EC' : '#3D2A1F' }}
      >
        CommerceLens
      </span>
    </div>
  );
}
