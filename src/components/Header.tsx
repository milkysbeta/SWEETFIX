import { useState } from 'react'
import { Logo, Wordmark } from './Logo'
import { site, waHello } from '../lib/site'
import { useScrollY } from '../lib/hooks'

// Deliberately short. The page is one scroll — the menu is for the three
// things someone might want to jump straight to.
const nav = [
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#enquire', label: 'Contact' },
]

export function Header({ onEnquire }: { onEnquire: () => void }) {
  const y = useScrollY()
  const [open, setOpen] = useState(false)
  const solid = y > 40

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? 'border-b border-slate/40 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label={`${site.name} home`}>
            <Logo className="h-9 w-auto text-bone" />
            <Wordmark className="hidden text-[15px] text-bone sm:block" />
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="label transition-colors duration-300 hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.phone}`}
              className="hidden rounded-[2px] border border-slate/70 px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-bone transition-colors duration-300 hover:border-timber hover:text-timber sm:block"
            >
              {site.phoneDisplay}
            </a>
            <button
              onClick={onEnquire}
              className="rounded-[2px] bg-timber px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:bg-timber-lit"
            >
              Enquire
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="ml-1 grid h-9 w-9 place-items-center rounded-[2px] border border-slate/70 md:hidden"
            >
              <span className="relative block h-[9px] w-4">
                <span
                  className={`absolute inset-x-0 top-0 h-px bg-bone transition-transform duration-300 ${open ? 'translate-y-[4px] rotate-45' : ''}`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-px bg-bone transition-transform duration-300 ${open ? '-translate-y-[4px] -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate/40 bg-ink/95 backdrop-blur-xl md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-slate/25 py-3 font-display text-lg text-bone last:border-0"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Thumb-reach action bar. Phones only — this is where the leads come from. */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate/50 bg-ink/90 backdrop-blur-xl sm:hidden">
        <a
          href={`tel:${site.phone}`}
          className="border-r border-slate/50 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-bone"
        >
          Call
        </a>
        <a
          href={waHello}
          target="_blank"
          rel="noopener noreferrer"
          className="py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-timber"
        >
          WhatsApp
        </a>
      </div>
    </>
  )
}
