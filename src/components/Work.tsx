import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { work } from '../lib/site'
import { Reveal, SectionLabel, GhostWord } from './Reveal'

/**
 * One project at a time, chosen from a strip of thumbnails.
 *
 * Every reference shows a single featured piece of work — Ostrolucky's
 * "featured projects" with prev/next, Logitech's parts carousel, Wallenford's
 * one bag. None of them stack six rows down the page. Showing one large image
 * trusts the photograph to do the work, and costs one screen instead of six.
 */
export function Work() {
  const [active, setActive] = useState(0)
  const item = work[active]
  const hero = item.images[0] ?? item.samples?.[0]
  const isSample = !item.images[0] && !!item.samples?.[0]

  const go = (dir: number) => setActive((i) => (i + dir + work.length) % work.length)

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="relative">
            <GhostWord>Work</GhostWord>
          </div>
          <SectionLabel index="02">Selected Work</SectionLabel>
        </Reveal>

        <Reveal delay={0.05}>
          {/* The featured frame */}
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-graphite">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {hero ? (
                  <img
                    src={hero}
                    alt={isSample ? 'Sample image — not Sweetfix work' : `${item.title}, ${item.location}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <p className="label">Photo coming</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Caption sits on the image, the way the references do it. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(19,20,22,0.25) 0%, transparent 30%, rgba(19,20,22,0.88) 100%)',
              }}
            />

            {isSample && (
              <span className="absolute left-4 top-4 border border-bone/25 bg-ink/75 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ash backdrop-blur">
                Sample
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-6 sm:p-10">
              <div>
                <p className="label mb-3">
                  {String(active + 1).padStart(2, '0')} / {item.tag} · {item.location}
                </p>
                <h3 className="display-lg text-[clamp(1.6rem,3.6vw,2.8rem)]">{item.title}</h3>
                <p className="mt-4 max-w-lg text-[15px] font-light leading-[1.75] text-ash">
                  {item.blurb}
                </p>
              </div>

              <div className="pointer-events-auto flex gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous project"
                  className="grid h-11 w-11 place-items-center border border-bone/25 bg-ink/60 text-bone backdrop-blur transition-colors hover:border-timber hover:text-timber"
                >
                  ←
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next project"
                  className="grid h-11 w-11 place-items-center border border-bone/25 bg-ink/60 text-bone backdrop-blur transition-colors hover:border-timber hover:text-timber"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Thumbnail strip */}
        <Reveal delay={0.1}>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {work.map((w, i) => {
              const thumb = w.images[0] ?? w.samples?.[0]
              return (
                <button
                  key={w.id}
                  onClick={() => setActive(i)}
                  aria-label={w.title}
                  aria-current={i === active ? 'true' : undefined}
                  className={`group relative aspect-[4/3] overflow-hidden border transition-all duration-500 ${
                    i === active ? 'border-timber' : 'border-transparent opacity-45 hover:opacity-80'
                  }`}
                >
                  {thumb ? (
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-graphite text-[9px] text-dust">
                      —
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-16 grid gap-8 border-t border-slate/30 pt-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <p className="display-lg text-[clamp(1.5rem,3vw,2.2rem)]">
              Queenstown and Wanaka.
              <br />
              <span className="serif-accent text-timber">Available worldwide.</span>
            </p>
            <p className="max-w-sm text-[15px] font-light leading-[1.8] text-ash">
              Festival builds in Europe, film work, remote projects. Travel and accommodation
              covered by the client.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
