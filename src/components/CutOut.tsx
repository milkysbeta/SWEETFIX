import { ParallaxImage } from './ParallaxImage'
import { overhang } from './Column'

/**
 * A tall cut-out that hangs over its section, roughly a third of the width,
 * alternating side to side down the page.
 *
 * Until the artwork exists it holds its space with a dashed portrait plate
 * that says what's coming — so the layout is already the real layout, and
 * dropping the PNG in later changes nothing else.
 */
export function CutOut({
  src,
  alt,
  side,
  label,
  speed = 0.18,
}: {
  src: string
  alt: string
  side: 'left' | 'right'
  /** Shown on the placeholder plate while the file is missing. */
  label: string
  speed?: number
}) {
  return (
    // Hangs out past the column edge on large screens — the cut-out is the
    // thing that stops the column reading as a plain box.
    <div className={`relative min-h-[24rem] lg:min-h-[40rem] ${overhang(side)}`}>
      <ParallaxImage
        src={src}
        alt={alt}
        speed={speed}
        className="absolute inset-x-0 bottom-0 top-[-5rem]"
        placeholder={
          // Pushed to the outer edge, not centred, so the plate sits where the
          // artwork will sit — hanging off the column rather than tucked in.
          <div
            className={`flex h-full w-full items-center p-4 ${
              side === 'left' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div className="flex h-full max-h-[34rem] w-full max-w-xs flex-col items-center justify-center rounded-[3px] border border-dashed border-slate/70 bg-gradient-to-b from-charcoal/60 to-transparent p-8 text-center">
              <div className="h-12 w-12 rounded-full border border-dashed border-slate" />
              <p className="label mt-5 leading-relaxed">{label}</p>
              <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.08em] text-dust/70">
                Transparent PNG
                <br />
                {src.split('/').pop()}
              </p>
            </div>
          </div>
        }
      />
    </div>
  )
}
