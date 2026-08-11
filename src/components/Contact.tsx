import { useState } from 'react'
import { jobTypes, site, waHello } from '../lib/site'
import { mailtoFallback, submitForm, type SubmitState } from '../lib/form'
import { Field, Honeypot, Input, Select, Submit, Textarea } from './Fields'
import { Reveal, SectionLabel, GhostWord } from './Reveal'

/**
 * The form sits on the page rather than behind a modal.
 *
 * Every reference ends with an open contact block — Absolute3D, TechGear and
 * Wallenford all put the fields right there. On a short page a modal is a
 * door in front of the one thing you want the visitor to do.
 */
export function Contact() {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data.botcheck) return

    setState('sending')
    const res = await submitForm(data, {
      subject: `New enquiry — ${data.name || 'Sweetfix website'}`,
      from: 'Sweetfix website',
    })

    if (res.ok) {
      setState('sent')
      form.reset()
      return
    }
    if (res.needsKey) {
      window.location.href = mailtoFallback(data, `Sweetfix enquiry — ${data.name || ''}`)
      setState('idle')
      return
    }
    setError(res.error ?? 'Something went wrong.')
    setState('error')
  }

  return (
    <section id="enquire" className="relative py-24 sm:py-32">
      <div className="px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="relative">
            <GhostWord>Contact</GhostWord>
          </div>
          <SectionLabel index="04">Get In Touch</SectionLabel>
        </Reveal>

        <div className="mt-8 grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal>
            <h2 className="display-lg text-[clamp(2rem,4.6vw,3.4rem)]">
              Got a list?
              <br />
              <span className="serif-accent text-timber">Let's get through it.</span>
            </h2>
            <p className="mt-7 max-w-sm text-[16px] font-light leading-[1.8] text-ash">
              Free quotes. {site.minimumHours}-hour minimum. After-hours callouts available. Tell
              me what's going on and I'll say straight whether I'm the right person for it.
            </p>

            <div className="mt-10 space-y-px bg-slate/30">
              {[
                { k: 'Phone', v: site.phoneDisplay, href: `tel:${site.phone}` },
                { k: 'WhatsApp', v: 'Message me', href: waHello },
                { k: 'Email', v: site.emailFallback, href: `mailto:${site.emailFallback}` },
                { k: 'Instagram', v: `@${site.instagram}`, href: site.instagramUrl },
              ].map((row) => (
                <a
                  key={row.k}
                  href={row.href}
                  target={row.k === 'Phone' || row.k === 'Email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between bg-charcoal/80 px-5 py-4 transition-colors duration-400 hover:bg-graphite/80"
                >
                  <span className="label">{row.k}</span>
                  <span className="font-display text-[15px] text-bone transition-colors group-hover:text-timber">
                    {row.v}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            {state === 'sent' ? (
              <div className="border border-slate/50 bg-charcoal/60 p-10">
                <p className="display-lg text-2xl text-timber">Got it.</p>
                <p className="mt-4 max-w-md text-[15px] font-light leading-[1.8] text-ash">
                  That's landed in my inbox. I'll come back to you as soon as I'm off the tools —
                  usually same day. If it's urgent, WhatsApp is faster.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <Honeypot />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" required>
                    <Input name="name" required autoComplete="name" placeholder="First name is fine" />
                  </Field>
                  <Field label="Phone" required>
                    <Input name="phone" type="tel" required autoComplete="tel" placeholder="022 000 0000" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email" required>
                    <Input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
                  </Field>
                  <Field label="Type of work">
                    <Select name="job_type" options={jobTypes} />
                  </Field>
                </div>
                <Field label="Describe the job" hint="As much or as little as you like.">
                  <Textarea name="details" placeholder="What needs doing, roughly how big it is…" />
                </Field>

                {state === 'error' && (
                  <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">
                    {error}{' '}
                    <a href={`tel:${site.phone}`} className="underline">
                      Or just call {site.phoneDisplay}.
                    </a>
                  </p>
                )}

                <Submit state={state}>Send enquiry</Submit>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
