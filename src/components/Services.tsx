import { services, site } from '../lib/site'
import { Reveal, SectionLabel, GhostWord } from './Reveal'

export function Services({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section id="services" className="relative px-6 py-28 sm:px-12 sm:py-36 lg:px-16">
      <Reveal>
        <div className="relative"><GhostWord>Trades</GhostWord></div>
          <SectionLabel index="01">What I Do</SectionLabel>
        <h2 className="max-w-3xl display-lg text-[clamp(2.2rem,5.5vw,4.25rem)]">
          One person, <span className="text-timber">most trades</span>, no runaround.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
          Most jobs need three different people and four phone calls. Usually they don't.{' '}
          {site.minimumHours}-hour minimum, and I'd rather take on the whole list than the one easy bit.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-px overflow-hidden rounded-[3px] border border-slate/40 bg-slate/40 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.05}>
            <article className="group relative h-full bg-ink p-8 transition-colors duration-500 hover:bg-charcoal">
              <span className="label text-timber/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 display-lg text-2xl text-bone">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ash">{s.blurb}</p>
              <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-[2px] border border-slate/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-dust transition-colors duration-500 group-hover:border-walnut group-hover:text-oak"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}

        <Reveal delay={services.length * 0.05}>
          <button
            onClick={onEnquire}
            className="flex h-full w-full flex-col justify-between bg-charcoal p-8 text-left transition-colors duration-500 hover:bg-graphite"
          >
            <span className="label text-timber/50">Not listed?</span>
            <span className="mt-5 display-lg text-2xl text-bone">
              Ask anyway.
              <br />
              <span className="text-timber">It's probably a yes.</span>
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  )
}
