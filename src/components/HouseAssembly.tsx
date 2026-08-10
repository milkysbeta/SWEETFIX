import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useReducedMotion } from '../lib/hooks'
import { SectionLabel } from './Reveal'

/**
 * Scroll-driven build sequence. The section is tall; the drawing sticks to
 * the viewport while you scroll through it, and each part flies in from its
 * own direction and settles into place — foundation first, roof last, the
 * order it happens on site.
 *
 * Everything is one inline SVG, so it's a few kB and stays razor-sharp at
 * any size. No images to load, nothing to wait for.
 */

type PartProps = {
  progress: MotionValue<number>
  /** Window of scroll progress over which this part flies in. */
  range: [number, number]
  from: { x?: number; y?: number; rotate?: number }
  reduced: boolean
  children: ReactNode
}

function Part({ progress, range, from, reduced, children }: PartProps) {
  const ease = [range[0], range[1]]
  const x = useTransform(progress, ease, [from.x ?? 0, 0])
  const y = useTransform(progress, ease, [from.y ?? 0, 0])
  const rotate = useTransform(progress, ease, [from.rotate ?? 0, 0])
  const opacity = useTransform(progress, [range[0], range[0] + (range[1] - range[0]) * 0.45], [0, 1])

  if (reduced) return <g>{children}</g>

  return (
    <motion.g style={{ x, y, rotate, opacity, originX: '50%', originY: '50%' }}>
      {children}
    </motion.g>
  )
}

const stages = [
  { at: 0.06, label: 'Foundation' },
  { at: 0.22, label: 'Floor' },
  { at: 0.38, label: 'Framing' },
  { at: 0.54, label: 'Trusses' },
  { at: 0.68, label: 'Roof' },
  { at: 0.82, label: 'Joinery' },
  { at: 0.92, label: 'Deck' },
]

function Stage({ progress, at, label }: { progress: MotionValue<number>; at: number; label: string }) {
  // The input range has to stay inside [0, 1] and strictly ascending —
  // scrollYProgress is normalised, and an out-of-range stop throws.
  const start = Math.max(0, at - 0.06)
  const end = Math.min(1, Math.max(at + 0.001, at + 0.16))
  const opacity = useTransform(progress, [start, at, end], [0.22, 1, 0.45])
  return (
    <motion.span style={{ opacity }} className="label text-bone">
      {label}
    </motion.span>
  )
}

function StageReadout({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
      {stages.map((s) => (
        <Stage key={s.label} progress={progress} at={s.at} label={s.label} />
      ))}
    </div>
  )
}

export function HouseAssembly() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const timber = '#a97e4e'
  const timberDark = '#6b4a2c'
  const steel = '#33363b'

  return (
    <section id="assembly" className="relative">
      {/* Tall track — the drawing sticks while this scrolls past. */}
      <div ref={ref} className="relative h-[380vh]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5">

          <div className="relative w-full max-w-2xl">
            <div className="mb-8 text-center">
              <SectionLabel index="05">How it goes together</SectionLabel>
            </div>

            <svg viewBox="0 0 400 300" className="w-full" role="img" aria-label="A house assembling itself, piece by piece">
              {/* Ground line */}
              <line x1="20" y1="258" x2="380" y2="258" stroke={steel} strokeWidth="1" />

              {/* Foundation */}
              <Part progress={scrollYProgress} range={[0.02, 0.16]} from={{ y: 70 }} reduced={reduced}>
                <rect x="92" y="240" width="216" height="18" rx="2" fill={steel} />
              </Part>

              {/* Floor platform */}
              <Part progress={scrollYProgress} range={[0.16, 0.3]} from={{ y: -90 }} reduced={reduced}>
                <rect x="86" y="228" width="228" height="12" rx="2" fill={timberDark} />
              </Part>

              {/* Wall framing — studs, left then right, arriving from the sides */}
              <Part progress={scrollYProgress} range={[0.3, 0.46]} from={{ x: -150 }} reduced={reduced}>
                <g fill={timber}>
                  <rect x="96" y="150" width="7" height="78" />
                  <rect x="120" y="150" width="7" height="78" />
                  <rect x="144" y="150" width="7" height="78" />
                  <rect x="168" y="150" width="7" height="78" />
                  <rect x="96" y="150" width="103" height="7" />
                </g>
              </Part>

              <Part progress={scrollYProgress} range={[0.32, 0.48]} from={{ x: 150 }} reduced={reduced}>
                <g fill={timber}>
                  <rect x="225" y="150" width="7" height="78" />
                  <rect x="249" y="150" width="7" height="78" />
                  <rect x="273" y="150" width="7" height="78" />
                  <rect x="297" y="150" width="7" height="78" />
                  <rect x="201" y="150" width="103" height="7" />
                </g>
              </Part>

              {/* Trusses, dropping in and rotating true */}
              <Part progress={scrollYProgress} range={[0.48, 0.62]} from={{ y: -130, rotate: -14 }} reduced={reduced}>
                <g stroke={timber} strokeWidth="6" strokeLinecap="round" fill="none">
                  <path d="M96 150 L200 92 L304 150" />
                  <path d="M130 150 L200 111" />
                  <path d="M270 150 L200 111" />
                  <path d="M200 92 L200 150" />
                </g>
              </Part>

              {/* Roof planes */}
              <Part progress={scrollYProgress} range={[0.62, 0.74]} from={{ x: -120, y: -60 }} reduced={reduced}>
                <path d="M88 156 L200 84 L200 96 L104 156 Z" fill={timberDark} />
              </Part>
              <Part progress={scrollYProgress} range={[0.64, 0.76]} from={{ x: 120, y: -60 }} reduced={reduced}>
                <path d="M312 156 L200 84 L200 96 L296 156 Z" fill={timberDark} />
              </Part>

              {/* Cladding */}
              <Part progress={scrollYProgress} range={[0.7, 0.82]} from={{ y: 60 }} reduced={reduced}>
                <g fill={timberDark} opacity="0.55">
                  <rect x="96" y="164" width="208" height="6" />
                  <rect x="96" y="178" width="208" height="6" />
                  <rect x="96" y="192" width="208" height="6" />
                  <rect x="96" y="206" width="208" height="6" />
                  <rect x="96" y="220" width="208" height="6" />
                </g>
              </Part>

              {/* Windows and door */}
              <Part progress={scrollYProgress} range={[0.78, 0.9]} from={{ y: -50 }} reduced={reduced}>
                <g>
                  <rect x="118" y="170" width="44" height="36" rx="2" fill="#c9e6f2" opacity="0.8" />
                  <rect x="238" y="170" width="44" height="36" rx="2" fill="#c9e6f2" opacity="0.8" />
                  <rect x="182" y="182" width="36" height="46" rx="2" fill={steel} />
                  <circle cx="211" cy="206" r="2.4" fill={timber} />
                </g>
              </Part>

              {/* Chimney */}
              <Part progress={scrollYProgress} range={[0.8, 0.9]} from={{ y: -70 }} reduced={reduced}>
                <rect x="256" y="104" width="20" height="34" rx="2" fill={steel} />
              </Part>

              {/* Deck — the last thing on, sliding in from the right */}
              <Part progress={scrollYProgress} range={[0.88, 0.99]} from={{ x: 130 }} reduced={reduced}>
                <g fill={timber}>
                  <rect x="304" y="228" width="72" height="7" rx="1.5" />
                  <rect x="304" y="238" width="72" height="5" rx="1.5" opacity="0.75" />
                  <rect x="306" y="243" width="5" height="15" opacity="0.6" />
                  <rect x="369" y="243" width="5" height="15" opacity="0.6" />
                </g>
              </Part>
            </svg>

            <div className="mt-10">
              <StageReadout progress={scrollYProgress} />
            </div>

            <p className="mx-auto mt-8 max-w-md text-center text-[15px] leading-relaxed text-ash">
              Foundation to deck. Whether it's the whole thing or one piece of it, the order
              doesn't change — and neither does the standard.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
