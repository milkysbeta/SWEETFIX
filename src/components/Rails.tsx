import { useEffect, useState } from 'react'
import { site } from '../lib/site'

const sections = [
  { id: 'top', label: 'Top' },
  { id: 'services', label: 'What I Do' },
  { id: 'work', label: 'Work' },
  { id: 'palapa', label: 'Palapa' },
  { id: 'shipwrecked', label: 'Treasure hunt' },
  { id: 'assembly', label: 'How it goes together' },
  { id: 'about', label: 'About' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'enquire', label: 'Contact' },
]

/**
 * Where you are in the page, as a column of dots down the left margin —
 * the device the reference product pages use. Clickable, because a position
 * indicator you can't steer with is just decoration.
 */
export function ScrollDots() {
  const [active, setActive] = useState('top')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex"
    >
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          aria-current={active === s.id ? 'true' : undefined}
          className="group relative grid h-3 w-3 place-items-center"
        >
          <span
            className={`rounded-[2px] transition-all duration-500 ${
              active === s.id ? 'h-2.5 w-2.5 bg-timber' : 'h-1.5 w-1.5 bg-bone/25 group-hover:bg-bone/60'
            }`}
          />
          <span className="pointer-events-none absolute left-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-ash opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  )
}

/** The wordmark set vertically down the outside of the column. */
export function SideWordmark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
      style={{ writingMode: 'vertical-rl' }}
    >
      <span className="font-display text-[13px] font-medium uppercase tracking-[0.55em] text-bone/15">
        {site.name} — {site.base}
      </span>
    </div>
  )
}
