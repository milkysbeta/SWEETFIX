import { services, site } from '../lib/site'
import { Reveal, SectionLabel, GhostWord } from './Reveal'

/**
 * Four columns, one screen — the row-of-services block every reference uses
 * (Absolute3D's four icons, TechGear's four cards). The previous version was
 * seven cards in a grid, which is a section you scroll rather than read.
 */
export function Services({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="relative">
            <GhostWord>Trades</GhostWord>
          </div>
          <SectionLabel index="01">What I Do</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <h2 className="display-lg text-[clamp(2rem,4.6vw,3.4rem)]">
              One person, <span className="serif-accent text-timber">most trades</span>,
              <br />
              no runaround.
            </h2>
            <p className="max-w-sm text-[15px] font-light leading-[1.8] text-ash">
              Most jobs need three different people and four phone calls. Usually they don't.{' '}
              {site.minimumHours}-hour minimum, and I'd rather take the whole list than the one
              easy bit.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-px bg-slate/30 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <article className="h-full bg-charcoal/80 p-7 transition-colors duration-500 hover:bg-graphite/80">
                <p className="font-mono text-[10px] tracking-[0.2em] text-timber/60">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-5 display-lg text-[1.15rem] leading-tight">{s.title}</h3>
                <p className="mt-4 text-[14px] font-light leading-[1.75] text-ash">{s.blurb}</p>
                <ul className="mt-5 space-y-1.5">
                  {s.items.map((it) => (
                    <li key={it} className="font-mono text-[10px] uppercase tracking-[0.12em] text-dust">
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <button
            onClick={onEnquire}
            className="mt-10 border border-slate px-8 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors duration-500 hover:border-timber hover:text-timber"
          >
            Not listed? Ask anyway
          </button>
        </Reveal>
      </div>
    </section>
  )
}
