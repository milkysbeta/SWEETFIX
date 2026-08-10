import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CutOut } from './CutOut'
import { Reveal, SectionLabel } from './Reveal'
import { treasure } from '../lib/site'

const STORE_KEY = 'sweetfix.chest.open'

function useCountdown(iso: string) {
  const target = useMemo(() => {
    if (!iso) return 0
    // 'rolling' keeps the demo timer alive — always the next midnight, so it
    // never sits expired on a portfolio piece nobody is racing.
    if (iso === 'rolling') {
      const d = new Date()
      d.setHours(24, 0, 0, 0)
      return d.getTime()
    }
    return new Date(iso).getTime()
  }, [iso])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target || Number.isNaN(target)) return null

  const remaining = Math.max(0, target - now)
  const s = Math.floor(remaining / 1000)
  return {
    expired: remaining === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function Digits({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-3xl font-medium tabular-nums text-cyan-200 sm:text-4xl">
        {String(value).padStart(2, '0')}
      </div>
      <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-200/45">
        {label}
      </div>
    </div>
  )
}

/**
 * Holographic panel — scanlines, chromatic edge, faint flicker. Deliberately
 * cyan against the site's timber palette so it reads as a projected display
 * rather than part of the furniture.
 */
function Hologram({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-8 blur-2xl"
        style={{
          background: 'radial-gradient(60% 60% at 50% 50%, rgba(80,220,255,0.20), transparent 70%)',
        }}
      />
      <div className="relative overflow-hidden rounded-[3px] border border-cyan-300/25 bg-cyan-500/[0.06] px-6 py-5 backdrop-blur-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            background:
              'repeating-linear-gradient(to bottom, rgba(120,230,255,0.10) 0px, rgba(120,230,255,0.10) 1px, transparent 1px, transparent 4px)',
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}

export function TreasureChest() {
  const countdown = useCountdown(treasure.unlockAt)
  const [open, setOpen] = useState(false)
  const [entry, setEntry] = useState('')
  const [wrong, setWrong] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (localStorage.getItem(STORE_KEY) === '1') setOpen(true)
  }, [])

  function tryCode(e: React.FormEvent) {
    e.preventDefault()
    const normalise = (s: string) => s.replace(/\s+/g, '').toLowerCase()
    if (normalise(entry) === normalise(treasure.code)) {
      setOpen(true)
      setWrong(false)
      localStorage.setItem(STORE_KEY, '1')
      return
    }
    setWrong(true)
    setEntry('')
    inputRef.current?.focus()
    setTimeout(() => setWrong(false), 1600)
  }

  return (
    <section
      id="shipwrecked"
      className="relative overflow-hidden   py-28 sm:py-36"
    >

      <div className="relative grid items-center gap-16 px-6 sm:px-12 lg:grid-cols-[1fr_0.95fr] lg:gap-10 lg:px-16">
        <div>
          <Reveal>
            <SectionLabel index="04">Project · The Treasure Hunt</SectionLabel>
            <h2 className="display-lg text-[clamp(2.2rem,5.5vw,4.25rem)]">
              A chest that
              <br />
              <span className="text-timber">had to be cracked</span>.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ash">
              A locked chest with a holographic countdown, built as a festival-wide treasure hunt.
              Clues hidden across the site, one code, and real prizes inside — passes, jewellery
              and collectible coins.
            </p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ash">
              Carpentry, electronics and game design in one object. Have a go at the replica —
              the hint gives it away.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 max-w-md">
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Hologram>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">
                        Chest unlocked
                      </p>
                      <p className="mt-4 text-lg leading-relaxed text-cyan-50">{treasure.reward}</p>
                    </Hologram>
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Hologram>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">
                        {countdown && !countdown.expired
                          ? 'Chest opens in'
                          : 'Locked · enter the code'}
                      </p>

                      {countdown && !countdown.expired && (
                        <div className="mt-5 flex justify-between gap-3">
                          <Digits value={countdown.days} label="Days" />
                          <Digits value={countdown.hours} label="Hrs" />
                          <Digits value={countdown.minutes} label="Min" />
                          <Digits value={countdown.seconds} label="Sec" />
                        </div>
                      )}

                      <form onSubmit={tryCode} className="mt-6 flex gap-2">
                        <input
                          ref={inputRef}
                          value={entry}
                          onChange={(e) => setEntry(e.target.value)}
                          placeholder="Enter the code"
                          aria-label="Treasure hunt code"
                          className={`min-w-0 flex-1 rounded-[2px] border bg-ink/50 px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-cyan-100 placeholder:normal-case placeholder:tracking-normal placeholder:text-cyan-200/30 focus:outline-none ${
                            wrong ? 'border-red-400/70' : 'border-cyan-300/30 focus:border-cyan-300/70'
                          }`}
                          style={wrong ? { animation: 'shake 0.4s' } : undefined}
                        />
                        <button
                          type="submit"
                          className="shrink-0 rounded-[2px] border border-cyan-300/40 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:bg-cyan-400/10"
                        >
                          Open
                        </button>
                      </form>

                      <p className="mt-4 font-mono text-[11px] leading-relaxed tracking-[0.06em] text-cyan-200/40">
                        {wrong ? 'Not it. Try again.' : treasure.hint}
                      </p>
                    </Hologram>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* The chest itself — cut-out PNG, drifting against the scroll. */}
        <div className="relative">
          <div
            aria-hidden
            className={`pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ background: 'radial-gradient(circle, rgba(224,170,107,0.55), transparent 70%)' }}
          />
          <CutOut
            src="/images/overlays/chest.png"
            alt="Treasure chest built for the festival treasure hunt"
            side="right"
            label="Treasure chest"
            speed={0.16}
          />
        </div>
      </div>
    </section>
  )
}
