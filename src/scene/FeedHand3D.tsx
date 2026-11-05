import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { FoodId } from '../lib/i18n'
import { FOODS, type FeedPhase } from '../lib/types'

interface Props {
  foodId: FoodId | null
  phase: FeedPhase
}

const HIDDEN = new THREE.Vector3(0.15, -1.6, 1.35)
const FEED = new THREE.Vector3(0.05, -0.35, 0.95)
const APPROACH = new THREE.Vector3(0.1, -0.9, 1.25)

function FoodMesh({ id }: { id: FoodId }) {
  const item = FOODS.find((f) => f.id === id)!
  switch (id) {
    case 'carrot':
      return (
        <group rotation={[0, 0, -0.4]}>
          <mesh>
            <coneGeometry args={[0.08, 0.28, 10]} />
            <meshStandardMaterial color={item.color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={item.accent} roughness={0.8} />
          </mesh>
        </group>
      )
    case 'apple':
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={item.color} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 6]} />
            <meshStandardMaterial color="#5c4033" />
          </mesh>
        </group>
      )
    case 'water':
      return (
        <mesh>
          <cylinderGeometry args={[0.09, 0.07, 0.14, 16]} />
          <meshStandardMaterial
            color={item.color}
            transparent
            opacity={0.65}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      )
    case 'treat':
      return (
        <mesh rotation={[0.4, 0.2, 0.1]}>
          <boxGeometry args={[0.16, 0.06, 0.08]} />
          <meshStandardMaterial color={item.color} roughness={0.75} />
        </mesh>
      )
    default:
      return (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[(i - 1) * 0.06, (i % 2) * 0.04, 0]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color={item.color} roughness={0.8} />
            </mesh>
          ))}
        </group>
      )
  }
}

function Finger({
  pos,
  rot,
  len = 0.28,
}: {
  pos: [number, number, number]
  rot?: [number, number, number]
  len?: number
}) {
  return (
    <mesh position={pos} rotation={rot ?? [0.2, 0, 0]} castShadow>
      <capsuleGeometry args={[0.045, len, 6, 10]} />
      <meshStandardMaterial color="#e8c4a8" roughness={0.65} />
    </mesh>
  )
}

export function FeedHand3D({ foodId, phase }: Props) {
  const ref = useRef<THREE.Group>(null)
  const target = useRef(HIDDEN.clone())
  const visible = phase !== 'hidden' && !!foodId

  useFrame((_, dt) => {
    if (!ref.current) return
    if (phase === 'approach') target.current.copy(APPROACH).lerp(FEED, 0.35)
    else if (phase === 'feed') target.current.copy(FEED)
    else if (phase === 'retreat') target.current.copy(HIDDEN)
    else target.current.copy(HIDDEN)

    ref.current.position.lerp(target.current, 1 - Math.exp(-dt * 7))
    const toMouth = phase === 'feed' || phase === 'approach'
    ref.current.rotation.x = THREE.MathUtils.damp(
      ref.current.rotation.x,
      toMouth ? -0.35 : 0.15,
      8,
      dt,
    )
    ref.current.visible = visible || ref.current.position.distanceTo(HIDDEN) > 0.05
  })

  return (
    <group ref={ref} position={HIDDEN.toArray()} visible={visible}>
      {/* palm */}
      <mesh position={[0, -0.12, 0]} castShadow>
        <sphereGeometry args={[0.22, 20, 16]} />
        <meshStandardMaterial color="#e0b898" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.05, 0.05]} scale={[1.1, 0.55, 0.9]} castShadow>
        <boxGeometry args={[0.42, 0.2, 0.28]} />
        <meshStandardMaterial color="#e8c4a8" roughness={0.68} />
      </mesh>

      <Finger pos={[-0.14, 0.12, 0.05]} rot={[0.35, 0.1, 0.15]} />
      <Finger pos={[-0.04, 0.18, 0.06]} rot={[0.45, 0, 0.05]} len={0.32} />
      <Finger pos={[0.06, 0.17, 0.05]} rot={[0.4, -0.05, -0.05]} len={0.3} />
      <Finger pos={[0.16, 0.1, 0.03]} rot={[0.3, -0.1, -0.2]} len={0.24} />

      {/* food between fingers */}
      <group position={[0, 0.22, 0.12]}>
        {foodId && <FoodMesh id={foodId} />}
      </group>
    </group>
  )
}
