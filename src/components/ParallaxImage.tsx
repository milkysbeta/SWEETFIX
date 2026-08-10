import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/hooks'

/**
 * A cut-out PNG that drifts against the scroll.
 *
 * Movement is measured from the element's own position in the viewport
 * rather than from absolute page scroll, so the drift is the same however
 * far down the page the section ends up sitting.
 *
 * If the file isn't there yet the whole thing removes itself — no broken
 * image icon, no gap in the layout.
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.12,
  className = '',
  fadeIn = true,
  placeholder,
}: {
  src: string
  alt: string
  /** Fraction of the scrolled distance to counter-move. ~0.1 is subtle. */
  speed?: number
  className?: string
  fadeIn?: boolean
  /** Shown in place of the image while the file doesn't exist yet. */
  placeholder?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [missing, setMissing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    let frame = 0

    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // -1 when the element is below the fold, +1 when it's above it.
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight
      setOffset(progress * speed * window.innerHeight)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduced, speed])

  if (missing && !placeholder) return null

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: reduced ? undefined : `translate3d(0, ${offset}px, 0)`,
        opacity: fadeIn && !loaded && !missing ? 0 : 1,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: reduced ? undefined : 'transform',
      }}
    >
      {missing && placeholder}
      <img
        hidden={missing}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setMissing(true)}
        className="h-full w-full object-contain"
        style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.55))' }}
      />
    </div>
  )
}
