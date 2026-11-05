import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { publicUrl, type Coat, type Mood } from '../lib/types'

interface Props {
  coat: Coat
  mood: Mood
  blinking: boolean
}

function FaceCard({
  url,
  mood,
  blinking,
}: {
  url: string
  mood: Mood
  blinking: boolean
}) {
  const tex = useTexture(url)
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.55, 1.55, 32, 32)
    const pos = g.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const r2 = (x * x + y * y) / (0.9 * 0.9)
      const z = Math.max(0, 0.18 * (1 - Math.min(1, r2)))
      pos.setZ(i, z)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  useLayoutEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    const img = tex.image as { width?: number; height?: number } | undefined
    const aspect = (img?.width ?? 1) / (img?.height ?? 1)
    if (aspect > 1.15) {
      const span = 1 / aspect
      tex.repeat.set(span, 1)
      tex.offset.set((1 - span) / 2, 0)
    } else if (aspect < 0.9) {
      const span = aspect
      tex.repeat.set(1, span)
      tex.offset.set(0, (1 - span) * 0.35)
    } else {
      tex.repeat.set(1, 1)
      tex.offset.set(0, 0)
    }
    tex.needsUpdate = true
  }, [tex])

  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    if (!matRef.current) return
    const t = clock.elapsedTime
    const longing = mood === 'longing' ? 0.04 + Math.sin(t * 2.2) * 0.015 : 0
    const happy = mood === 'happy' ? 0.03 : 0
    matRef.current.emissiveIntensity = longing + happy
  })

  return (
    <group position={[0, 0.18, 0.42]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial
          ref={matRef}
          map={tex}
          roughness={0.72}
          metalness={0.02}
          emissive="#fff2df"
          emissiveIntensity={0}
          side={THREE.FrontSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[1.58, 1.58, 0.1]} />
        <meshStandardMaterial color="#2a2118" roughness={0.9} metalness={0} />
      </mesh>

      <EyeSpec x={-0.28} y={0.18} mood={mood} blinking={blinking} />
      <EyeSpec x={0.28} y={0.18} mood={mood} blinking={blinking} />

      {(blinking || mood === 'satisfied') && (
        <mesh position={[0, 0.16, 0.12]}>
          <planeGeometry args={[1.2, mood === 'satisfied' ? 0.22 : 0.38]} />
          <meshBasicMaterial
            color="#1a120c"
            transparent
            opacity={mood === 'satisfied' ? 0.55 : 0.85}
            depthWrite={false}
          />
        </mesh>
      )}

      {mood === 'eating' && (
        <mesh position={[0, -0.28, 0.14]}>
          <circleGeometry args={[0.16, 20]} />
          <meshBasicMaterial color="#0d0806" transparent opacity={0.55} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}

function EyeSpec({
  x,
  y,
  mood,
  blinking,
}: {
  x: number
  y: number
  mood: Mood
  blinking: boolean
}) {
  const ref = useRef<THREE.Mesh>(null)
  const scale =
    mood === 'longing' ? 1.35 : mood === 'happy' ? 1.15 : mood === 'eating' ? 0.75 : 1

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pulse = mood === 'longing' ? 1 + Math.sin(clock.elapsedTime * 3) * 0.06 : 1
    const s = blinking || mood === 'satisfied' ? 0.05 : scale * pulse
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref} position={[x, y, 0.16]}>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.9}
        roughness={0.15}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function Ear({
  side,
  color,
  inner,
}: {
  side: -1 | 1
  color: string
  inner: string
}) {
  return (
    <group position={[side * 0.72, 0.55, 0.05]} rotation={[0.15, side * -0.35, side * 0.55]}>
      <mesh castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh scale={[0.7, 0.85, 0.55]} position={[side * -0.02, -0.02, 0.08]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color={inner} roughness={0.9} />
      </mesh>
    </group>
  )
}

export function PugModel({ coat, mood, blinking }: Props) {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const url = publicUrl(coat.photo)

  useFrame(({ clock }) => {
    if (!root.current || !body.current) return
    const t = clock.elapsedTime
    const breathSpeed = mood === 'satisfied' ? 1.1 : 1.7
    const breath = 1 + Math.sin(t * breathSpeed) * (mood === 'eating' ? 0.012 : 0.018)
    let sx = breath
    let sy = breath
    let sz = breath
    if (mood === 'eating') {
      sx = 1.08
      sy = 0.9
      sz = 1.05
    } else if (mood === 'happy') {
      const pop = 1 + Math.sin(t * 10) * 0.025
      sx = sy = sz = pop
    }
    body.current.scale.set(sx, sy, sz)

    const sway = Math.sin(t * 0.55) * 0.04
    const lean = mood === 'longing' ? 0.08 : mood === 'eating' ? 0.12 : 0
    root.current.rotation.y = sway
    root.current.rotation.x = lean
    root.current.position.y = Math.sin(t * breathSpeed) * 0.015
  })

  return (
    <group ref={root} position={[0, -0.15, 0]}>
      <group ref={body}>
        <mesh position={[0, -0.55, -0.15]} castShadow receiveShadow>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color={coat.fur} roughness={0.88} />
        </mesh>
        <mesh position={[0, -0.35, 0.15]} scale={[1.05, 0.75, 0.9]} castShadow>
          <sphereGeometry args={[0.55, 28, 28]} />
          <meshStandardMaterial color={coat.furDark} roughness={0.9} />
        </mesh>

        <mesh position={[0, 0.15, 0.05]} castShadow>
          <sphereGeometry args={[0.78, 32, 32]} />
          <meshStandardMaterial color={coat.fur} roughness={0.86} />
        </mesh>

        <Ear side={-1} color={coat.fur} inner={coat.ear} />
        <Ear side={1} color={coat.fur} inner={coat.ear} />

        <FaceCard url={url} mood={mood} blinking={blinking} />

        <mesh position={[0, -0.22, 0.35]} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.42, 0.035, 12, 40]} />
          <meshStandardMaterial color="#6e5210" roughness={0.55} metalness={0.15} />
        </mesh>
      </group>
    </group>
  )
}
