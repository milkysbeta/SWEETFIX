import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 2600

/** Page scroll as 0→1, read straight off the document each frame. */
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

/**
 * Dull white motes on black-grey, drifting up through a flow field.
 *
 * Two things are tied to page scroll: the field tilts up in perspective, and
 * the camera pushes very slightly in. Both are slow and small on purpose —
 * the movement should read as depth, not as an effect.
 */
function Motes({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const points = useRef<THREE.Points>(null)
  const { camera } = useThree()
  const scroll = useRef(0)

  const { positions, drift } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const drift = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18
      drift[i] = Math.random() * 0.5 + 0.2
    }
    return { positions, drift }
  }, [])

  // Soft round dot, drawn once into a canvas — no network request, and it
  // keeps the particles circular rather than square.
  const sprite = useMemo(() => {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.45, 'rgba(255,255,255,0.5)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    const mesh = points.current
    if (!g || !mesh) return

    // Ease toward the real scroll position so a flick of the wheel doesn't
    // snap the whole field around.
    scroll.current += (scrollProgress() - scroll.current) * 0.045

    // Tilt up in perspective, plus a touch of yaw so it never looks flat.
    g.rotation.x = -scroll.current * 0.42
    g.rotation.y = scroll.current * 0.12

    // The displacement: camera creeps in as you go down the page.
    camera.position.z = 12 - scroll.current * 2.4

    if (reduced) return

    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const attr = mesh.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      // Rise slowly.
      arr[iy] += drift[i] * dt * 0.22

      // Flow field: two out-of-phase sines standing in for curl noise, so
      // the motes eddy and curl rather than falling in straight lines.
      const fx = Math.sin(arr[iy] * 0.12 + t * 0.08) + Math.cos(arr[iz] * 0.09 - t * 0.05)
      const fz = Math.cos(arr[ix] * 0.1 - t * 0.06) + Math.sin(arr[iy] * 0.08 + t * 0.04)
      arr[ix] += fx * dt * 0.055
      arr[iz] += fz * dt * 0.04

      // Wrap at the top so the field never empties out.
      if (arr[iy] > 12) {
        arr[iy] = -12
        arr[ix] = (Math.random() - 0.5) * 34
      }
    }
    attr.needsUpdate = true
  })

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          sizeAttenuation
          map={sprite}
          transparent
          depthWrite={false}
          color="#e8e6e2"
          opacity={0.1}
        />
      </points>
    </group>
  )
}

/**
 * Fixed behind the whole page. Sections sit on top with semi-transparent
 * backgrounds so the field stays faintly visible the whole way down.
 */
export function ParticleField({ reduced = false }: { reduced?: boolean }) {
  const [visible, setVisible] = useState(!document.hidden)

  // Stop rendering while the tab is in the background. A full-page canvas
  // that keeps drawing to an unseen tab is just battery.
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
      >
        <Motes reduced={reduced} />
      </Canvas>
    </div>
  )
}
