import { site, waHello } from '../lib/site'
import { Reveal, SectionLabel, GhostWord } from './Reveal'

export function Contact({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section id="enquire" className="relative px-6 py-28 sm:px-12 sm:py-36 lg:px-16">
      <Reveal>
        <div className="relative"><GhostWord>Contact</GhostWord></div>
          <SectionLabel index="08">Get In Touch</SectionLabel>
        <h2 className="max-w-3xl display-lg text-[clamp(2.4rem,6.5vw,5rem)]">
          Got a list?
          <br />
          <span className="text-timber">Let's get through it.</span>
        </h2>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ash">
          Free quotes. {site.minimumHours}-hour minimum. After-hours callouts available. Tell me
          what's going on and I'll tell you straight whether I'm the right person for it.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-12 flex flex-wrap gap-3">
          <button
            onClick={onEnquire}
            className="rounded-[2px] bg-bone px-8 py-4 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-transform duration-300 hover:scale-[1.02]"
          >
            Open the enquiry form
          </button>
          <a
            href={waHello}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] border border-slate px-8 py-4 font-mono text-[12px] uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-timber hover:text-timber"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${site.phone}`}
            className="rounded-[2px] border border-slate px-8 py-4 font-mono text-[12px] uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-timber hover:text-timber"
          >
            {site.phoneDisplay}
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.14}>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[3px] border border-slate/40 bg-slate/40 sm:grid-cols-3">
          {[
            { k: 'Phone', v: site.phoneDisplay, href: `tel:${site.phone}` },
            { k: 'Email', v: site.emailFallback, href: `mailto:${site.emailFallback}` },
            { k: 'Instagram', v: `@${site.instagram}`, href: site.instagramUrl },
          ].map((row) => (
            <a
              key={row.k}
              href={row.href}
              target={row.k === 'Instagram' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group bg-ink p-8 transition-colors duration-500 hover:bg-charcoal"
            >
              <p className="label">{row.k}</p>
              <p className="mt-3 font-display text-lg font-semibold text-bone transition-colors group-hover:text-timber">
                {row.v}
              </p>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
