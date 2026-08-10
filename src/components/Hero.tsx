import { motion } from 'framer-motion'
import { Logo } from './Logo'
import { site, waHello } from '../lib/site'
import { useReducedMotion, useScrollY } from '../lib/hooks'

const rise = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, delay: 0.15 + i * 0.11, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Hero({ onEnquire }: { onEnquire: () => void }) {
  const reduced = useReducedMotion()
  const y = useScrollY()

  return (
    <section id="top" className="relative flex min-h-[86svh] items-center overflow-hidden">
      {/* The particle field lives behind the whole page — see App.
          What's left here is the warm light raking across it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 70% at 15% 5%, rgba(192,138,75,0.10), transparent 60%)',
          transform: reduced ? undefined : `translate3d(0, ${y * 0.1}px, 0)`,
        }}
      />

      {/* The mark, sunk into the background and bleeding off the right edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 hidden -translate-y-1/2 lg:block"
        style={{ transform: reduced ? undefined : `translate3d(0, calc(-50% + ${y * -0.14}px), 0)` }}
      >
        <Logo className="h-[78vh] w-auto text-bone/[0.03]" title="" />
      </div>

      {/* Technical annotation, vertical along the right edge. */}
      <div
        aria-hidden
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 xl:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-mono text-[10px] tracking-[0.35em] text-dust/50">
          45°01′52″S · 168°39′44″E
        </span>
      </div>

      <div className="relative z-10 px-6 sm:px-12 lg:px-16 pb-24 pt-20">
        <motion.div
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mb-9 flex items-center gap-4"
        >
          <span className="label">{site.base}</span>
          <span className="rule-fade w-16 shrink-0" />
          <span className="label">Est. {new Date().getFullYear() - site.yearsExperience}</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="display-xl text-[clamp(3rem,10vw,9rem)]"
        >
          Fix it.
          <br />
          Build it.
          <br />
          <span className="serif-accent lowercase text-timber">sorted.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-10 max-w-md text-[17px] font-light leading-[1.75] text-ash"
        >
          {site.yearsExperience} years of building, renovation and fix-it work — and a van with
          everything in it. Quiet, tidy, and very good at this.
        </motion.p>

        <motion.div
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={onEnquire}
            className="rounded-full bg-bone px-9 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-transform duration-500 hover:scale-[1.02]"
          >
            Tell me about the job
          </button>
          <a
            href={waHello}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate/70 px-9 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors duration-500 hover:border-timber hover:text-timber"
          >
            WhatsApp
          </a>
        </motion.div>

        <motion.div
          custom={4}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-slate/30 pt-8"
        >
          {site.credentials.map((c, i) => (
            <div key={c.label}>
              <p className="font-mono text-[10px] tracking-[0.2em] text-timber/50">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-3 font-display text-[15px] font-normal uppercase tracking-[0.08em] text-bone">
                {c.label}
              </p>
              <p className="mt-1.5 text-[13px] font-light leading-relaxed text-dust">{c.note}</p>
            </div>
          ))}
        </motion.div>
      </div>

      
    </section>
  )
}
