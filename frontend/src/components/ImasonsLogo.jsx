/**
 * ImasonsLogo.jsx
 *
 * Renders the official iMasons Foundation brand PNG assets.
 *
 * Props:
 *   variant    "light" (default) | "dark"
 *              - "light": purple logo (for white/light backgrounds)
 *              - "dark":  white logo (for dark/purple backgrounds)
 *   markOnly   boolean — show only the monogram mark, no wordmark
 *   className  string  — passed to the <img> for sizing (e.g. "h-8", "h-10")
 */
export default function ImasonsLogo({ variant = 'light', markOnly = false, className = 'h-10' }) {
  if (markOnly) {
    const src = variant === 'dark'
      ? '/images/logo-imasons-foundation-monogram-white.png'
      : '/images/logo-imasons-foundation-monogram-purple.png';
    return (
      <img
        src={src}
        alt="iMasons Foundation monogram"
        className={className}
      />
    );
  }

  const src = variant === 'dark'
    ? '/images/logo-imasons-foundation-white.png'
    : '/images/logo-imasons-foundation-purple.png';
  return (
    <img
      src={src}
      alt="iMasons Foundation"
      className={className}
    />
  );
}
