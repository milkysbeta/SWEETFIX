import { testimonials } from '../lib/site'
import { Reveal, SectionLabel, GhostWord } from './Reveal'

/**
 * Real reviews only. Until there are any, the section stays but says so
 * plainly and points at the questionnaire — an honest empty state is better
 * than an invented quote, and better than a menu link that goes nowhere.
 */
export function Testimonials() {
  const empty = testimonials.length === 0

  return (
    <section id="testimonials" className="  py-28 sm:py-36">
      <div className="px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="relative"><GhostWord>Reviews</GhostWord></div>
          <SectionLabel index="07">Testimonials</SectionLabel>
        </Reveal>

        {empty ? (
          <Reveal delay={0.06}>
            <div className="max-w-2xl">
              <h2 className="display-lg text-[clamp(2rem,5vw,3.4rem)]">
                Worked with me
                <br />
                <span className="text-timber">before?</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ash">
                This is where reviews from past clients and site crews will sit. If we've worked
                together — a job, a build, a festival season — five minutes of your time would
                genuinely help.
              </p>
              <a
                href="#/reviews"
                className="mt-9 inline-block rounded-[2px] border border-slate px-8 py-4 font-mono text-[12px] uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-timber hover:text-timber"
              >
                Leave a review
              </a>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 0.06}>
                <figure className="h-full rounded-[3px] border border-slate/40 bg-charcoal p-8">
                  <blockquote className="text-lg leading-relaxed text-bone">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 border-t border-slate/40 pt-5">
                    <p className="font-display text-sm font-semibold uppercase tracking-wider text-bone">
                      {t.name}
                    </p>
                    <p className="label mt-1">{[t.job, t.location].filter(Boolean).join(' · ')}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
