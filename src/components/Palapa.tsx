import { CutOut } from './CutOut'
import { Reveal, SectionLabel } from './Reveal'

/**
 * Fusion Festival — the Palapa stage.
 *
 * Three photo tiles step down the left; the cut-out tower PNG overlays the
 * last of them and breaks out past the top edge, so the structure reads as
 * taller than the frame that holds it.
 */
const tiles = [
  { src: '/images/work/fusion-palapa-stage/01.jpg', caption: 'Structure going up' },
  { src: '/images/work/fusion-palapa-stage/02.jpg', caption: 'Scenic detail' },
  { src: '/images/work/fusion-palapa-stage/03.jpg', caption: 'Under lights' },
]

function Tile({ src, caption, index }: { src: string; caption: string; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <figure className="group relative overflow-hidden rounded-[3px] border border-slate/40 bg-graphite">
        <div className="aspect-[5/4] overflow-hidden">
          <img
            src={src}
            alt={caption}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Hold the space with the empty plate rather than a broken icon.
              e.currentTarget.style.display = 'none'
            }}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
        </div>
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-5 pb-4 pt-10">
          <span className="label">{caption}</span>
        </figcaption>
      </figure>
    </Reveal>
  )
}

export function Palapa() {
  return (
    <section id="palapa" className="relative overflow-hidden py-28 sm:py-36">

      <div className="relative px-6 sm:px-12 lg:px-16">
        <Reveal>
          <SectionLabel index="03">Fusion Festival · Germany</SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 className="max-w-2xl display-lg text-[clamp(2.2rem,5.5vw,4.25rem)]">
              The Palapa
              <br />
              <span className="text-timber">stage build</span>.
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-ash">
              One of Europe's most visually ambitious festivals. Structural carpentry and scenic
              design doing the same job at the same time.
            </p>
          </div>
        </Reveal>

        {/* Tower hangs off the left; the photo tiles sit to its right. */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[0.5fr_1fr] lg:items-end">
          <CutOut
            src="/images/overlays/palapa_tower.png"
            alt="Palapa tower structure built for Fusion Festival"
            side="left"
            label="Palapa tower"
            speed={0.2}
          />

          <div className="grid gap-6 sm:grid-cols-3">
            {tiles.map((t, i) => (
              <Tile key={t.src} {...t} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
