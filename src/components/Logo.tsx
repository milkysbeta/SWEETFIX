import { useId } from 'react'

/**
 * Sweetfix mark — skull over a crossed hammer and open-ended spanner.
 *
 * Drawn as flat solids with no strokes so it stays legible at 16px (favicon)
 * and at 1.2m (van door). Uses currentColor throughout, so it inherits
 * whatever it sits on. This is a placeholder-quality mark built to be usable
 * immediately and replaced later without touching any layout.
 */
export function Logo({ className = '', title = 'Sweetfix' }: { className?: string; title?: string }) {
  // The eye sockets, nose and teeth are cut out with a mask rather than
  // painted in the page colour. Painting them only works when the thing
  // behind is exactly that colour — the moment the mark sits on a lighter
  // panel, or at low opacity as a watermark, filled features read as a solid
  // shape instead of a skull. Holes are holes on any background.
  const maskId = useId()

  return (
    <svg
      viewBox="0 0 120 132"
      className={className}
      role="img"
      aria-label={title}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Crossed tools, behind the skull ── */}
      <g opacity="0.95">
        {/* Open-ended spanner, lower-left to upper-right */}
        <g transform="rotate(-21 60 102)">
          <path d="M40 90 L22 90 L15 97 L15 107 L22 114 L40 114 L40 106 L28 106 L26 102 L28 98 L40 98 Z" />
          <rect x="38" y="97.5" width="60" height="9" rx="4.5" />
          <circle cx="99" cy="102" r="6" />
        </g>

        {/* Claw hammer, lower-right to upper-left */}
        <g transform="rotate(21 60 102)">
          <rect x="22" y="97.5" width="62" height="9" rx="4.5" />
          <path d="M83 87 L99 87 L105 93 L105 111 L99 117 L83 117 Z" />
          {/* claw split */}
          <path d="M83 87 L83 96 L76 91 Z" />
          <path d="M83 117 L83 108 L76 113 Z" />
        </g>
      </g>

      {/* ── Skull ── */}
      <mask id={maskId} maskUnits="userSpaceOnUse">
        {/* White is kept, black is cut away. */}
        <rect x="0" y="0" width="120" height="132" fill="#fff" />
        <ellipse cx="45" cy="44" rx="10" ry="11" fill="#000" />
        <ellipse cx="75" cy="44" rx="10" ry="11" fill="#000" />
        <path d="M60 55 L52 68 L68 68 Z" fill="#000" />
        <rect x="38" y="72" width="44" height="2.5" fill="#000" />
        <rect x="50" y="74" width="2.5" height="14" fill="#000" />
        <rect x="58.75" y="74" width="2.5" height="14" fill="#000" />
        <rect x="67.5" y="74" width="2.5" height="14" fill="#000" />
      </mask>

      <path
        mask={`url(#${maskId})`}
        d="M60 8 C39 8 25 22 25 42 C25 54 30 62 36 68 L36 78 C36 84 40 88 46 88 L74 88 C80 88 84 84 84 78 L84 68 C90 62 95 54 95 42 C95 22 81 8 60 8 Z"
      />
    </svg>
  )
}

/**
 * Wordmark, kept as a separate element from the mark so the two can be
 * locked up horizontally, stacked, or used apart.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-display font-extrabold uppercase leading-none ${className}`}
      style={{ letterSpacing: '0.16em' }}
    >
      Sweetfix
    </span>
  )
}
