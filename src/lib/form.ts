import { site } from './site'

export type SubmitState = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Posts a form to Web3Forms, which emails the answers straight through.
 * No server, no database, nothing to maintain — which is the whole reason
 * it suits a static site on GitHub Pages.
 *
 * If no access key is configured yet, this returns `needsKey` so the caller
 * can fall back to a mailto: link. An enquiry must never disappear quietly
 * because a key was missing.
 */
export async function submitForm(
  data: Record<string, string>,
  opts: { subject: string; from: string },
): Promise<{ ok: boolean; needsKey?: boolean; error?: string }> {
  if (!site.formAccessKey) return { ok: false, needsKey: true }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: site.formAccessKey,
        subject: opts.subject,
        from_name: opts.from,
        ...data,
      }),
    })
    const json = (await res.json()) as { success?: boolean; message?: string }
    return json.success ? { ok: true } : { ok: false, error: json.message ?? 'Something went wrong.' }
  } catch {
    return { ok: false, error: 'Network error — check your connection and try again.' }
  }
}

/** Builds a mailto: link carrying the answers, for the no-key fallback. */
export function mailtoFallback(data: Record<string, string>, subject: string) {
  const body = Object.entries(data)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}\n${v}`)
    .join('\n\n')
  const to = site.formAccessKey ? site.email : site.emailFallback
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
