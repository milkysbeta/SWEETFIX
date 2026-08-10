import { useState } from 'react'
import { Logo, Wordmark } from './Logo'
import { site } from '../lib/site'

/**
 * Design credit. The logo sits at 10% saturation and comes up to full on
 * hover with a long ease. If the file isn't there, the credit degrades to
 * plain text rather than a broken image.
 */
function DesignerCredit() {
  const [missing, setMissing] = useState(false)
  const { name, logo, url, credit } = site.designer

  const inner = (
    <span className="group inline-flex items-center gap-2.5">
      <span className="font-mono text-[11px] tracking-[0.1em] text-dust transition-colors duration-500 group-hover:text-ash">
        {credit} {name}
      </span>
      {!missing && (
        <img
          src={logo}
          alt={`${name} logo`}
          onError={() => setMissing(true)}
          className="h-6 w-auto saturate-[0.1] transition-[filter,opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:saturate-100"
          style={{ opacity: 0.55 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.55')}
        />
      )}
    </span>
  )

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  )
}

export function Footer() {
  return (
    <footer className="border-t border-slate/40  pb-24 pt-16 sm:pb-16">
      <div className="mx-auto max-w-[1180px] px-10 sm:px-16">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <div>
            <div className="flex items-center gap-4">
              <Logo className="h-12 w-auto text-bone" />
              <Wordmark className="text-xl text-bone" />
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ash">
              {site.tagline} Building, renovation and fix-it work across {site.base} — and{' '}
              {site.reach}.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-8">
            <div>
              <p className="label">Contact</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                <li>
                  <a href={`tel:${site.phone}`} className="text-bone hover:text-timber">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.emailFallback}`} className="text-bone hover:text-timber">
                    {site.emailFallback}
                  </a>
                </li>
                <li>
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone hover:text-timber"
                  >
                    @{site.instagram}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="label">More</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                <li>
                  <a href="#/reviews" className="text-bone hover:text-timber">
                    Leave a review
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-bone hover:text-timber">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-bone hover:text-timber">
                    Work
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rule-fade mt-14" />

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="font-mono text-[11px] tracking-[0.1em] text-dust">
              © {new Date().getFullYear()} {site.name} · {site.owner}
              {site.nzbn && ` · NZBN ${site.nzbn}`}
            </p>
            <DesignerCredit />
          </div>
          <p className="max-w-lg font-mono text-[11px] leading-relaxed tracking-[0.06em] text-dust">
            Details you send through this site are used only to reply to your enquiry. They aren't
            sold or shared. Ask any time and they'll be deleted.
          </p>
        </div>
      </div>
    </footer>
  )
}
