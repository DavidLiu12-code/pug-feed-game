import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Mood } from '../lib/types'

interface Props {
  mood: Mood
  active: boolean
}

export function Crumbs({ mood, active }: Props) {
  const ref = useRef<THREE.Points>(null)
  const count = 18
  const velocities = useMemo(() => {
    const v = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      v[i * 3] = (Math.random() - 0.5) * 0.4
      v[i * 3 + 1] = 0.2 + Math.random() * 0.5
      v[i * 3 + 2] = 0.1 + Math.random() * 0.3
    }
    return v
  }, [])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 0.15
      p[i * 3 + 1] = -0.15 + Math.random() * 0.1
      p[i * 3 + 2] = 0.55 + Math.random() * 0.1
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  }, [])

  const life = useRef(0)

  useFrame((_, dt) => {
    if (!ref.current) return
    const show = active && mood === 'eating'
    if (show) life.current = Math.min(1, life.current + dt * 2)
    else life.current = Math.max(0, life.current - dt * 1.5)

    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < count; i++) {
      if (!show) continue
      arr[i * 3] += velocities[i * 3] * dt
      arr[i * 3 + 1] += velocities[i * 3 + 1] * dt
      arr[i * 3 + 2] += velocities[i * 3 + 2] * dt
      velocities[i * 3 + 1] -= 1.2 * dt
      if (arr[i * 3 + 1] < -0.4) {
        arr[i * 3] = (Math.random() - 0.5) * 0.12
        arr[i * 3 + 1] = -0.1
        arr[i * 3 + 2] = 0.55
        velocities[i * 3 + 1] = 0.25 + Math.random() * 0.4
      }
    }
    attr.needsUpdate = true
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = life.current * 0.7
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.035}
        color="#c4a060"
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
