import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { jobTypes, site, timeframes, waHello } from '../lib/site'
import { mailtoFallback, submitForm, type SubmitState } from '../lib/form'
import { Field, Honeypot, Input, Select, Submit, Textarea } from './Fields'
import { Logo } from './Logo'

export function EnquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data.botcheck) return

    // Which section of the page they were reading when they opened this.
    data.source = `${site.domain}${window.location.hash || ''}`

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
      // No form service wired up yet — hand it to their mail client instead
      // of losing the enquiry.
      window.location.href = mailtoFallback(data, `Sweetfix enquiry — ${data.name || ''}`)
      setState('idle')
      return
    }
    setError(res.error ?? 'Something went wrong.')
    setState('error')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/85 p-4 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry form"
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="my-auto w-full max-w-2xl rounded-2xl border border-slate/60 bg-charcoal shadow-2xl"
          >
            <div className="flex items-start justify-between gap-6 border-b border-slate/50 p-7 sm:p-9">
              <div>
                <div className="flex items-center gap-3">
                  <Logo className="h-7 w-auto text-timber" title="" />
                  <span className="label">Enquiry</span>
                </div>
                <h2 className="mt-4 display-lg text-3xl">
                  Tell me about the job
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ash">
                  Name and a phone number is enough to start. The rest just means I can give you a
                  straighter answer.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-full border border-slate/60 p-2.5 text-ash transition-colors hover:border-bone/40 hover:text-bone"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>

            {state === 'sent' ? (
              <div className="p-9 text-center sm:p-14">
                <p className="display-lg text-2xl text-timber">
                  Got it.
                </p>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ash">
                  That's landed in my inbox. I'll come back to you as soon as I'm off the tools —
                  usually same day. If it's urgent, WhatsApp is faster.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={waHello}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-slate px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-bone hover:border-timber hover:text-timber"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-bone px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6 p-7 sm:p-9">
                <Honeypot />

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Your name" required>
                    <Input name="name" required autoComplete="name" placeholder="Matt Sweetman" />
                  </Field>
                  <Field label="Phone" required>
                    <Input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="022 000 0000"
                    />
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Email" required>
                    <Input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Where's the job?">
                    <Input name="location" placeholder="Queenstown, Wanaka, elsewhere…" />
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Type of work">
                    <Select name="job_type" options={jobTypes} />
                  </Field>
                  <Field label="Timeframe">
                    <Select name="timeframe" options={timeframes} placeholder="When suits?" />
                  </Field>
                </div>

                <Field label="Describe the job" hint="As much or as little as you like.">
                  <Textarea
                    name="details"
                    placeholder="What needs doing, roughly how big it is, anything you've already tried…"
                  />
                </Field>

                {state === 'error' && (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">
                    {error}{' '}
                    <a href={`tel:${site.phone}`} className="underline">
                      Or just call {site.phoneDisplay}.
                    </a>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-5 pt-1">
                  <Submit state={state}>Send enquiry</Submit>
                  <p className="text-[13px] leading-relaxed text-dust">
                    Or call{' '}
                    <a href={`tel:${site.phone}`} className="text-ash underline">
                      {site.phoneDisplay}
                    </a>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
