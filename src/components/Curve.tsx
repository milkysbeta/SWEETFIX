/**
 * A slow curved break between sections, borrowed from the way a live-edge
 * slab meets its surroundings. Sits at the top of a section and sweeps the
 * section's colour up over whatever came before it.
 */
export function Curve({
  className = '',
  flip = false,
}: {
  className?: string
  flip?: boolean
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${flip ? 'bottom-0' : 'top-0'} ${className}`}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[60px] w-full sm:h-[90px]"
      >
        <path d="M0 90 C 420 90 520 0 1440 0 L1440 90 Z" fill="currentColor" />
      </svg>
    </div>
  )
}
