import type { ReactNode } from 'react'

/**
 * The centre column.
 *
 * A slightly lighter grey than the page, held at partial opacity with a
 * heavy backdrop blur, so the particle field behind reads as depth through
 * frosted glass rather than as decoration sitting on top.
 *
 * Overflow is deliberately visible: cut-out images hang off the left and
 * right edges and must not be clipped.
 */
export function Column({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6">
      <div className="grain-wood relative rounded-[28px] border border-bone/[0.07] bg-charcoal/75 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        <div className="relative z-[1]">{children}</div>
      </div>
    </div>
  )
}

/**
 * Horizontal padding for anything sitting inside the column. Kept in one
 * place so every section lines up on the same two edges.
 */
export const inset = 'px-6 sm:px-12 lg:px-16'

/**
 * Pulls a cut-out out past the column edge. Below `lg` it stays inside —
 * there simply isn't room to hang anything off a phone.
 */
export function overhang(side: 'left' | 'right') {
  return side === 'left' ? 'lg:-ml-28 xl:-ml-40' : 'lg:-mr-28 xl:-mr-40'
}
