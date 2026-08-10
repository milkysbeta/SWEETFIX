import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Content lifts and fades in as it enters the viewport. One shared easing
 * across the whole site so the movement reads as one hand, not five.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ children, index }: { children: ReactNode; index: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="label text-timber/70">{index}</span>
      <span className="rule-fade w-10 shrink-0" />
      <span className="label">{children}</span>
    </div>
  )
}

/**
 * The section's subject set very large and very faint behind its heading —
 * the device the reference pages use to give each block a sense of weight
 * without adding another line anyone has to read.
 */
export function GhostWord({ children }: { children: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-6 left-0 select-none whitespace-nowrap font-display font-medium uppercase leading-none tracking-[-0.02em] text-bone/[0.035] sm:-top-10"
      style={{ fontSize: 'clamp(4rem, 12vw, 11rem)' }}
    >
      {children}
    </span>
  )
}
