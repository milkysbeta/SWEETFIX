import type { ReactNode } from 'react'

const base =
  'w-full rounded-lg border border-slate/60 bg-ink/60 px-4 py-3.5 text-[15px] text-bone placeholder:text-dust transition-colors duration-300 focus:border-timber focus:outline-none'

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="label block text-ash">
        {label}
        {required && <span className="ml-1 text-timber">*</span>}
      </span>
      {hint && <span className="mt-1.5 block text-[13px] leading-relaxed text-dust">{hint}</span>}
      <div className="mt-2.5">{children}</div>
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} min-h-32 resize-y leading-relaxed`} />
}

export function Select({
  options,
  placeholder,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }) {
  return (
    <select {...props} className={`${base} appearance-none`}>
      <option value="">{placeholder ?? 'Choose one…'}</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-charcoal">
          {o}
        </option>
      ))}
    </select>
  )
}

export function Submit({
  state,
  children,
}: {
  state: 'idle' | 'sending' | 'sent' | 'error'
  children: ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={state === 'sending' || state === 'sent'}
      className="w-full rounded-full bg-timber px-8 py-4 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:bg-timber-lit disabled:opacity-55 sm:w-auto"
    >
      {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Sent — thanks' : children}
    </button>
  )
}

/** Honeypot. Bots fill it in, people never see it. */
export function Honeypot() {
  return (
    <input
      type="checkbox"
      name="botcheck"
      tabIndex={-1}
      autoComplete="off"
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
      aria-hidden
    />
  )
}
