import { work } from '../lib/site'
import { Reveal, SectionLabel, GhostWord } from './Reveal'
import { Curve } from './Curve'
import { RailNode } from './Rail'
import type { WorkItem } from '../lib/site'

/** Empty plate — never a stock photo of somebody else's job. */
function Plate({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-graphite/60">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 rounded-full border border-dashed border-slate" />
        {label && <p className="label mt-4">{label}</p>}
      </div>
    </div>
  )
}

function Shot({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <Plate label="Photo coming" />
      )}
    </div>
  )
}

/**
 * One project per row, alternating side to side, with a second frame
 * overlapping the first at an offset. The asymmetry is the point — a tidy
 * grid of equal tiles makes everything look like a catalogue.
 */
function Row({ item, index, total }: { item: WorkItem; index: number; total: number }) {
  const flip = index % 2 === 1

  return (
    <Reveal className="group">
      <article className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-16 lg:pl-14">
        <RailNode index={index} total={total} />
        {/* Images */}
        <div className={`relative ${flip ? 'lg:order-2 lg:pl-12' : 'lg:pr-12'}`}>
          <Shot
            src={item.images[0]}
            alt={`${item.title} — ${item.location}`}
            className="aspect-[4/3] w-full"
          />

          {/* Second frame, breaking out over the first */}
          <div
            className={`absolute -bottom-10 hidden w-[42%] border-4 border-ink shadow-2xl sm:block ${
              flip ? 'left-0 lg:left-4' : 'right-0 lg:right-6'
            }`}
          >
            <Shot
              src={item.images[1]}
              alt={`${item.title}, detail`}
              className="aspect-square w-full"
            />
          </div>

          <span className="absolute -top-6 left-0 font-mono text-[10px] tracking-[0.24em] text-timber/50">
            {String(index + 1).padStart(2, '0')} / {item.tag.toUpperCase()}
          </span>
        </div>

        {/* Text */}
        <div className={flip ? 'lg:order-1 lg:pr-6' : 'lg:pl-6'}>
          <div className="mb-5 flex items-center gap-4">
            <span className="rule-fade w-12 shrink-0" />
            <span className="label">{item.location}</span>
          </div>

          <h3 className="display-lg text-[clamp(1.7rem,3.4vw,2.6rem)]">{item.title}</h3>

          <p className="mt-6 max-w-md text-[16px] font-light leading-[1.8] text-ash">
            {item.blurb}
          </p>

          {item.images.length > 2 && <p className="label mt-7">+{item.images.length - 2} more</p>}
        </div>
      </article>
    </Reveal>
  )
}

export function Work() {
  return (
    <section id="work" className="relative  pb-32 pt-24 sm:pb-40 sm:pt-28">
      <Curve className="-translate-y-full text-pitch/70" />

      <div className="px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="relative">
            <GhostWord>Work</GhostWord>
          </div>
          <SectionLabel index="02">Selected Work</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <h2 className="display-lg text-[clamp(2.2rem,5.5vw,4.25rem)]">
              Houses, decks,
              <br />
              and <span className="serif-accent text-timber">festival stages</span>.
            </h2>
            <p className="max-w-sm text-[15px] font-light leading-[1.8] text-ash">
              Fifteen years across private homes, new builds, and some of Europe's more ambitious
              festival structures.
            </p>
          </div>
        </Reveal>

        <div className="mt-24 space-y-28 sm:space-y-36">
          {work.map((item, i) => (
            <Row key={item.id} item={item} index={i} total={work.length} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-32 grid gap-8 border-t border-slate/30 pt-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <p className="display-lg text-[clamp(1.6rem,3.2vw,2.4rem)]">
              Based in Queenstown and Wanaka.
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
