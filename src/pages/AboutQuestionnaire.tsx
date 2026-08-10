import { useState } from 'react'
import { Logo, Wordmark } from '../components/Logo'
import { Field, Honeypot, Input, Submit, Textarea } from '../components/Fields'
import { mailtoFallback, submitForm, type SubmitState } from '../lib/form'
import { Reveal } from '../components/Reveal'

/**
 * Matt's own questionnaire. He said writing about himself is hard — so
 * instead of a blank "tell us about yourself" box, this asks small, concrete
 * questions. Answering them gives enough raw material to write the About
 * section in his actual voice.
 */
const groups: { title: string; questions: { name: string; label: string; hint?: string }[] }[] = [
  {
    title: 'How you got here',
    questions: [
      { name: 'origin', label: 'Where did you grow up, and where are you based now?' },
      {
        name: 'start',
        label: 'How did you get into building?',
        hint: 'Apprenticeship, fell into it, family, something else?',
      },
      {
        name: 'path',
        label: 'What have the last 15 years actually looked like?',
        hint: 'Rough arc is fine — companies, countries, kinds of work.',
      },
      {
        name: 'festivals',
        label: 'How did the festival and set-building work come about?',
      },
    ],
  },
  {
    title: 'The work',
    questions: [
      {
        name: 'proudest',
        label: "What's the job you're proudest of, and why?",
      },
      {
        name: 'hardest',
        label: "What's the hardest problem you've solved on a site?",
        hint: 'The story where you worked something out that nobody else could.',
      },
      {
        name: 'favourite_work',
        label: 'What kind of work do you most enjoy?',
      },
      {
        name: 'least',
        label: 'What do you least enjoy, or would rather not be called about?',
      },
      {
        name: 'different',
        label: 'What do you do differently from other builders?',
        hint: "Doesn't have to be grand. Tidiness, communication, turning up when you say you will.",
      },
    ],
  },
  {
    title: 'How you work',
    questions: [
      {
        name: 'clients_say',
        label: 'What do clients most often say about you?',
      },
      {
        name: 'first_visit',
        label: 'What happens when someone calls you about a job?',
        hint: 'Do you visit, quote, start straight away? Helps people know what to expect.',
      },
      {
        name: 'tools',
        label: "What's in the van?",
        hint: 'Being specific here is surprisingly persuasive.',
      },
      {
        name: 'tech',
        label: 'How did you end up doing WiFi, automation and 3D printing too?',
      },
    ],
  },
  {
    title: 'The rest',
    questions: [
      {
        name: 'why_queenstown',
        label: 'Why Queenstown and Wanaka?',
      },
      {
        name: 'travel',
        label: 'What sort of project would get you on a plane?',
      },
      {
        name: 'outside_work',
        label: "What do you do when you're not working?",
        hint: 'People hire people. One human detail does a lot.',
      },
      {
        name: 'one_sentence',
        label: 'If someone remembered one sentence about you, what should it be?',
      },
      {
        name: 'anything',
        label: 'Anything else that should be on the site?',
      },
    ],
  },
]

export function AboutQuestionnaire() {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data.botcheck) return

    setState('sending')
    const res = await submitForm(data, {
      subject: 'Sweetfix — About Matt answers',
      from: 'Sweetfix about form',
    })

    if (res.ok) {
      setState('sent')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (res.needsKey) {
      window.location.href = mailtoFallback(data, 'Sweetfix — About Matt answers')
      setState('idle')
      return
    }
    setError(res.error ?? 'Something went wrong.')
    setState('error')
  }

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        <a href="#top" className="mb-14 flex items-center gap-3">
          <Logo className="h-9 w-auto text-bone" />
          <Wordmark className="text-[15px] text-bone" />
        </a>

        {state === 'sent' ? (
          <Reveal>
            <h1 className="display-lg text-4xl sm:text-5xl">
              Sent.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ash">
              That's everything needed to write the About section properly.
            </p>
          </Reveal>
        ) : (
          <>
            <Reveal>
              <p className="label text-timber/70">Internal · for Matt</p>
              <h1 className="mt-5 display-lg text-[clamp(2.2rem,7vw,3.6rem)]">
                Twenty questions,
                <br />
                <span className="text-timber">so I don't have to</span> write a bio.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-ash">
                Short answers. Don't write it well — just say it how you'd say it in the van. Skip
                anything you don't fancy.
              </p>
            </Reveal>

            <form onSubmit={onSubmit} className="mt-14 space-y-12">
              <Honeypot />
              <Field label="Name">
                <Input name="name" defaultValue="Matt Sweetman" />
              </Field>

              {groups.map((g) => (
                <section key={g.title} className="space-y-7">
                  <div className="flex items-center gap-4">
                    <h2 className="label text-timber/70">{g.title}</h2>
                    <span className="rule-fade flex-1" />
                  </div>
                  {g.questions.map((q) => (
                    <Field key={q.name} label={q.label} hint={q.hint}>
                      <Textarea name={q.name} placeholder="…" />
                    </Field>
                  ))}
                </section>
              ))}

              {state === 'error' && (
                <p className="rounded-[2px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">
                  {error}
                </p>
              )}

              <Submit state={state}>Send answers</Submit>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
