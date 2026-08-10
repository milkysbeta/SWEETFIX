import { site } from '../lib/site'
import { Reveal, SectionLabel, GhostWord } from './Reveal'
import { Logo } from './Logo'

/**
 * TODO(matt): this copy is a stand-in written from what you've told me so
 * far. Fill in the "About Matt" questionnaire at /about-questions and this
 * gets rewritten in your own words.
 */
export function About() {
  return (
    <section id="about" className="relative px-6 py-28 sm:px-12 sm:py-36 lg:px-16">
      <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div>
          <Reveal>
            <div className="relative"><GhostWord>Matt</GhostWord></div>
          <SectionLabel index="06">About</SectionLabel>
            <h2 className="display-lg text-[clamp(2.2rem,5.5vw,4.25rem)]">
              Matt
              <br />
              <span className="text-timber">Sweetman</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ash">
              <p>
                Fifteen years on the tools — new builds, renovations, and every kind of fix-it job
                in between. Somewhere in there I also spent seasons building festival stages in
                Europe and props for screen work, which is where you learn to build things that
                are structurally sound <em className="text-bone not-italic">and</em> look
                extraordinary.
              </p>
              <p>
                That mix is the point. I'm as comfortable framing a wall as I am sorting out the
                WiFi dead spot in the back bedroom, or designing and printing the bracket that
                nobody sells any more. One person, one van, most of it covered.
              </p>
              <p>
                Based between {site.base}. Site Safe certified, first aid current, and available
                for callouts after hours.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-slate/40 pt-10 sm:grid-cols-3">
              {[
                { k: 'Experience', v: `${site.yearsExperience} years` },
                { k: 'Based', v: site.base },
                { k: 'Reach', v: 'Worldwide' },
                { k: 'Minimum', v: `${site.minimumHours} hours` },
                { k: 'After hours', v: 'Available' },
                { k: 'Certified', v: 'Site Safe · First Aid' },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="label">{row.k}</dt>
                  <dd className="mt-2 font-display text-lg font-semibold text-bone">{row.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
          {/* TODO(matt): swap for a photo of you on site —
              public/images/matt.jpg — one good shot beats ten of finished walls. */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] border border-slate/40 bg-gradient-to-br from-charcoal via-ink to-charcoal">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(70% 50% at 30% 20%, rgba(192,138,75,0.14), transparent 60%)',
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <Logo className="h-40 w-auto text-bone/[0.07]" title="" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="label">Photo of Matt — coming</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
