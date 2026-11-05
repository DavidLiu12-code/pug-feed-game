import { ContactShadows, Environment } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { FoodId } from '../lib/i18n'
import type { Coat, FeedPhase, Mood } from '../lib/types'
import { Crumbs } from './Crumbs'
import { FeedHand3D } from './FeedHand3D'
import { PugModel } from './PugModel'
import { StudioLights } from './StudioLights'

interface SceneProps {
  coat: Coat
  mood: Mood
  blinking: boolean
  foodId: FoodId | null
  feedPhase: FeedPhase
  trauma: number
}

function CameraRig({ trauma, feedPhase }: { trauma: number; feedPhase: FeedPhase }) {
  const { camera } = useThree()
  const tRef = useRef(0)
  const shake = useRef(0)

  useEffect(() => {
    shake.current = Math.min(1, shake.current + trauma)
  }, [trauma])

  useFrame((_, dt) => {
    tRef.current += dt
    shake.current = Math.max(0, shake.current - dt * 1.4)
    const s = shake.current * shake.current
    const nudge = feedPhase === 'feed' || feedPhase === 'approach' ? 0.08 : 0
    const baseZ = 2.55 - nudge
    const baseY = 0.12
    camera.position.x = Math.sin(tRef.current * 0.35) * 0.04 + Math.sin(tRef.current * 28) * s * 0.025
    camera.position.y = baseY + Math.sin(tRef.current * 0.5) * 0.02 + Math.sin(tRef.current * 31) * s * 0.018
    camera.position.z = THREE.MathUtils.damp(camera.position.z, baseZ, 4, dt)
    camera.lookAt(0, 0.05, 0)
  })

  return null
}

function Scene({ coat, mood, blinking, foodId, feedPhase, trauma }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#efe6d6']} />
      <fog attach="fog" args={['#efe6d6', 6, 14]} />
      <StudioLights />
      <Environment preset="warehouse" environmentIntensity={0.35} />
      <CameraRig trauma={trauma} feedPhase={feedPhase} />

      <Suspense fallback={null}>
        <PugModel key={coat.id} coat={coat} mood={mood} blinking={blinking} />
        <Crumbs mood={mood} active={feedPhase === 'feed'} />
      </Suspense>

      <FeedHand3D foodId={foodId} phase={feedPhase} />

      {/* soft ground / cushion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]} receiveShadow>
        <circleGeometry args={[2.4, 48]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.95} />
      </mesh>
      <ContactShadows
        position={[0, -1.14, 0]}
        opacity={0.35}
        scale={6}
        blur={2.4}
        far={3}
        color="#3d2e22"
      />
    </>
  )
}

export function GameCanvas(props: SceneProps) {
  return (
    <div className="game-canvas absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.12, 2.55], fov: 38, near: 0.1, far: 40 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.05
        }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  )
}
