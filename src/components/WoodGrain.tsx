import { useEffect, useRef } from 'react'

/**
 * End grain — a timber cross-section, drawn rather than photographed.
 *
 * The reference that keeps coming back is a live-edge slab filling the whole
 * frame: concentric growth rings, off-centre pith, the rings crowding
 * together at one edge and opening out at the other. That is what this
 * draws — a few hundred wobbled rings around an off-centre origin, warm
 * walnut, with a pool of light raking across it.
 *
 * Generated because a photograph of someone else's timber is not Matt's
 * timber. This costs a few kilobytes, scales to any screen, and can be
 * retinted from the palette.
 */
export function WoodGrain({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const parent = canvas.parentElement
      if (!parent) return
      // Cap the pixel ratio — this is a background, not a photograph, and a
      // 3x canvas on a phone costs more than it returns.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      if (!w || !h) return

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Pith sits off to one side, the way a slab is rarely cut through the
      // middle. Rings therefore crowd on one edge and open out on the other.
      const cx = w * 0.72
      const cy = h * 1.15

      ctx.fillStyle = '#3a2718'
      ctx.fillRect(0, 0, w, h)

      const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy))
      const rings = 260
      const segments = 200

      // A cheap layered sine standing in for noise — enough to stop the
      // rings reading as machine-perfect circles.
      const wobble = (a: number, r: number) =>
        Math.sin(a * 3 + r * 0.05) * 6 +
        Math.sin(a * 7.3 - r * 0.02) * 3.5 +
        Math.sin(a * 13.7 + r * 0.011) * 1.8 +
        Math.sin(r * 0.09) * 4

      for (let i = 0; i < rings; i++) {
        // Ring spacing tightens and loosens, like seasons of growth.
        const t = i / rings
        const r = maxR * (t + Math.sin(t * 22) * 0.006)
        if (r <= 0) continue

        // Earlywood is pale and wide, latewood dark and narrow — the
        // contrast between the two is what makes timber read as timber.
        const late = (Math.sin(i * 0.7) + 1) / 2
        const lightness = 0.18 + late * 0.5
        ctx.strokeStyle = `rgba(${Math.round(190 * lightness + 40)}, ${Math.round(
          130 * lightness + 26,
        )}, ${Math.round(80 * lightness + 16)}, ${0.55 + late * 0.4})`
        ctx.lineWidth = 0.8 + late * 2.4

        ctx.beginPath()
        for (let s = 0; s <= segments; s++) {
          const a = (s / segments) * Math.PI * 2
          const rr = r + wobble(a, r)
          const x = cx + Math.cos(a) * rr
          // Slight vertical squash — a slab is cut at an angle to the trunk.
          const y = cy + Math.sin(a) * rr * 0.82
          s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // A few radial checks, the splits that open from the pith outward.
      ctx.strokeStyle = 'rgba(18, 12, 8, 0.55)'
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.4
        ctx.lineWidth = 1.2 + (i % 3) * 0.8
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        for (let k = 0; k <= 40; k++) {
          const rr = (k / 40) * maxR
          const aa = a + Math.sin(rr * 0.02 + i) * 0.03
          ctx.lineTo(cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr * 0.82)
        }
        ctx.stroke()
      }

      // Light raking across, then a heavy vignette — the staging every one
      // of the references uses to make a surface feel lit rather than flat.
      const light = ctx.createRadialGradient(w * 0.28, h * 0.2, 0, w * 0.28, h * 0.2, maxR * 0.9)
      light.addColorStop(0, 'rgba(255, 216, 165, 0.34)')
      light.addColorStop(0.45, 'rgba(255, 190, 130, 0.12)')
      light.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = light
      ctx.fillRect(0, 0, w, h)

      const vig = ctx.createRadialGradient(w * 0.4, h * 0.4, Math.min(w, h) * 0.15, w * 0.5, h * 0.5, maxR)
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vig.addColorStop(0.6, 'rgba(0, 0, 0, 0.34)')
      vig.addColorStop(1, 'rgba(0, 0, 0, 0.82)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, w, h)
    }

    draw()

    // Redraw on resize, but not on every pixel of a drag.
    let t: number | undefined
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(draw, 180)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
