import { useEffect, useRef, useState } from 'react'

/**
 * A vertical rail with a node per row, lit as it passes the middle of the
 * viewport. Taken from the product pages in the references, where a spine
 * threads the feature rows together.
 *
 * It earns its place here because the rows genuinely are a sequence — the
 * projects run oldest to newest down the page. A rail on unordered content
 * would be decoration pretending to be structure.
 */
export function RailNode({ index, total }: { index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setLit(entry.isIntersecting),
      // A band across the middle of the screen, so a node lights while its
      // row is the one being read.
      { rootMargin: '-40% 0px -40% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    // Explicit width so left-1/2 has something to centre against, and the
    // spine runs past the row's own box to bridge the gap to the next one.
    <div ref={ref} className="pointer-events-none absolute left-0 top-0 hidden h-full w-14 lg:block">
      {/* Spine. Fades in on the first row and stops at the node on the last,
          so the line begins and ends with the list rather than the viewport. */}
      <span
        className="absolute left-1/2 w-px -translate-x-1/2 bg-slate"
        style={{
          top: index === 0 ? '50%' : '-7rem',
          bottom: index === total - 1 ? '50%' : '-7rem',
        }}
      />
      {index === 0 && (
        <span className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-slate" />
      )}

      {/* Node */}
      <span
        className={`absolute left-1/2 top-1/2 grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-all duration-700 ${
          lit ? 'border-timber bg-ink' : 'border-slate bg-ink'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full transition-all duration-700 ${
            lit ? 'scale-100 bg-timber' : 'scale-0 bg-slate'
          }`}
        />
      </span>
      {lit && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
          style={{ background: 'radial-gradient(circle, rgba(192,138,75,0.35), transparent 70%)' }}
        />
      )}
    </div>
  )
}
