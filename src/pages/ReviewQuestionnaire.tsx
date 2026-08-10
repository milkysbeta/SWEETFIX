import { useState } from 'react'
import { Logo, Wordmark } from '../components/Logo'
import { Field, Honeypot, Input, Submit, Textarea } from '../components/Fields'
import { mailtoFallback, submitForm, type SubmitState } from '../lib/form'
import { site } from '../lib/site'
import { Reveal } from '../components/Reveal'

/**
 * Sent to past clients and employers. Everything except the name is
 * optional — a half-filled form still gives Matt something usable, and a
 * wall of required fields is how you get zero responses.
 */
const questions: { name: string; label: string; hint?: string; long?: boolean }[] = [
  {
    name: 'relationship',
    label: 'How do you know Matt?',
    hint: 'Client, employer, site foreman, worked alongside him — whatever fits.',
  },
  {
    name: 'job',
    label: 'What was the job?',
    hint: 'Rough is fine. "Deck and some fencing", "full bathroom reno", "festival stage build".',
  },
  { name: 'when_where', label: 'Roughly when, and where?' },
  {
    name: 'why_matt',
    label: 'Why did you go with Matt rather than someone else?',
    long: true,
  },
  {
    name: 'how_it_went',
    label: 'How did it go?',
    hint: 'The honest version is more useful than the polite one.',
    long: true,
  },
  {
    name: 'standout',
    label: 'Anything that stood out — good or bad?',
    hint: 'Turning up on time, tidiness, problem-solving, the finish, communication.',
    long: true,
  },
  {
    name: 'recommend',
    label: 'Would you have him back, or recommend him?',
    long: true,
  },
  {
    name: 'anything_else',
    label: 'Anything else you want to add?',
    long: true,
  },
]

export function ReviewQuestionnaire() {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data.botcheck) return

    setState('sending')
    const res = await submitForm(data, {
      subject: `Sweetfix review — ${data.name || 'anonymous'}`,
      from: 'Sweetfix review form',
    })

    if (res.ok) {
      setState('sent')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (res.needsKey) {
      window.location.href = mailtoFallback(data, `Sweetfix review — ${data.name || ''}`)
      setState('idle')
      return
    }
    setError(res.error ?? 'Something went wrong.')
    setState('error')
  }

  return (
    <main className="min-h-screen bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            'radial-gradient(90% 60% at 20% 0%, rgba(192,138,75,0.12), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        <a href="#top" className="mb-14 flex items-center gap-3">
          <Logo className="h-9 w-auto text-bone" />
          <Wordmark className="text-[15px] text-bone" />
        </a>

        {state === 'sent' ? (
          <Reveal>
            <p className="label text-timber/70">Sent</p>
            <h1 className="mt-5 display-lg text-4xl sm:text-5xl">
              Thank you.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ash">
              Genuinely appreciated — that kind of thing is worth more to a one-man operation than
              any amount of advertising. If Matt wants to use part of it on the website he'll check
              with you first.
            </p>
            <a
              href="#top"
              className="mt-10 inline-block rounded-[2px] border border-slate px-8 py-4 font-mono text-[12px] uppercase tracking-[0.16em] text-bone hover:border-timber hover:text-timber"
            >
              Back to the site
            </a>
          </Reveal>
        ) : (
          <>
            <Reveal>
              <p className="label text-timber/70">A favour, if you've got five minutes</p>
              <h1 className="mt-5 display-lg text-[clamp(2.2rem,7vw,3.6rem)]">
                Tell people
                <br />
                <span className="text-timber">what I'm like</span> to work with.
              </h1>
              <div className="mt-7 space-y-4 text-lg leading-relaxed text-ash">
                <p>
                  I'm putting together a website for {site.name} and I'd rather it had real words
                  from people I've worked for than marketing copy I wrote about myself.
                </p>
                <p>
                  Answer whatever you like and skip the rest — anything you leave blank simply
                  won't appear. Nothing goes on the website without checking with you first.
                </p>
              </div>
            </Reveal>

            <form onSubmit={onSubmit} className="mt-14 space-y-8">
              <Honeypot />

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Your name" required>
                  <Input name="name" required placeholder="First name is fine" />
                </Field>
                <Field label="Town / suburb">
                  <Input name="location" placeholder="Arrowtown, Wanaka…" />
                </Field>
              </div>

              <Field label="Email or phone" hint="Only so Matt can thank you and check before using anything.">
                <Input name="contact" placeholder="Optional" />
              </Field>

              <div className="rule-fade my-2" />

              {questions.map((q) => (
                <Field key={q.name} label={q.label} hint={q.hint}>
                  {q.long ? (
                    <Textarea name={q.name} placeholder="Optional" />
                  ) : (
                    <Input name={q.name} placeholder="Optional" />
                  )}
                </Field>
              ))}

              <div className="rule-fade my-2" />

              <Field
                label="Can Matt use your answers on the website?"
                hint="Say how you'd like to be credited — full name, first name and suburb, or anonymous."
              >
                <Input name="permission" placeholder="e.g. First name and suburb is fine" />
              </Field>

              {state === 'error' && (
                <p className="rounded-[2px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <Submit state={state}>Send it through</Submit>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
