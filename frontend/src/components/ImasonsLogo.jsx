/**
 * ImasonsLogo.jsx
 *
 * Inline SVG recreation of the iMasons Foundation logo.
 * Based on the official brand images: a geometric "i" mark (dot + stem)
 * alongside two stacked horizontal dashes (teal top, cyan bottom),
 * with the "iMasons" bold wordmark and "Foundation" sub-mark.
 *
 * Props:
 *   variant    "light" (default) | "dark"
 *              - "light": purple mark + teal/cyan dashes + purple wordmark (white backgrounds)
 *              - "dark":  white mark + white wordmark + cyan dash (dark purple backgrounds)
 *   markOnly   boolean — show only the icon mark, no wordmark text
 *   className  string  — passed to the root <svg> for sizing (e.g. "h-8", "h-10")
 */
export default function ImasonsLogo({ variant = 'light', markOnly = false, className = 'h-10' }) {
  const isLight = variant === 'light';

  // Color palette
  const purple     = isLight ? '#5D0E67' : '#FFFFFF';
  const tealDash   = isLight ? '#1E5C6C' : '#FFFFFF';
  const cyanDash   = '#50ECEC';                         // always cyan regardless of variant
  const wordmark   = isLight ? '#5D0E67' : '#FFFFFF';
  const foundation = isLight ? '#1E5C6C' : 'rgba(255,255,255,0.80)';

  if (markOnly) {
    /* Mark-only: viewBox sized tightly to just the icon */
    return (
      <svg
        viewBox="0 0 36 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="iMasons logo mark"
        role="img"
      >
        {/* Dot of the "i" */}
        <rect x="0" y="0" width="10" height="10" rx="1.5" fill={purple} />
        {/* Stem of the "i" */}
        <rect x="0" y="14" width="10" height="26" rx="1.5" fill={purple} />
        {/* Top teal dash */}
        <rect x="14" y="0" width="22" height="10" rx="1.5" fill={tealDash} />
        {/* Bottom cyan dash */}
        <rect x="14" y="14" width="22" height="10" rx="1.5" fill={cyanDash} />
      </svg>
    );
  }

  /* Full logo with wordmark */
  return (
    <svg
      viewBox="0 0 220 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="iMasons Foundation"
      role="img"
    >
      {/* ── Icon mark ── */}
      {/* Dot of the "i" */}
      <rect x="0" y="0" width="10" height="10" rx="1.5" fill={purple} />
      {/* Stem of the "i" */}
      <rect x="0" y="14" width="10" height="26" rx="1.5" fill={purple} />
      {/* Top teal dash */}
      <rect x="14" y="0" width="22" height="10" rx="1.5" fill={tealDash} />
      {/* Bottom cyan dash */}
      <rect x="14" y="14" width="22" height="10" rx="1.5" fill={cyanDash} />

      {/* ── Wordmark ── */}
      {/* "iMasons" — bold, large */}
      <text
        x="44"
        y="26"
        fontFamily="'Poppins', sans-serif"
        fontWeight="700"
        fontSize="22"
        fill={wordmark}
        letterSpacing="-0.3"
      >
        iMasons
      </text>
      {/* "Foundation" — medium weight, smaller, below */}
      <text
        x="45"
        y="38"
        fontFamily="'Poppins', sans-serif"
        fontWeight="500"
        fontSize="10.5"
        fill={foundation}
        letterSpacing="1.2"
      >
        FOUNDATION
      </text>
    </svg>
  );
}
