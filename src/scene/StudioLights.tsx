export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.45} color="#fff6ea" />
      {/* warm key */}
      <directionalLight
        position={[2.2, 3.4, 2.8]}
        intensity={1.35}
        color="#ffe4c4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0002}
      />
      {/* soft fill */}
      <directionalLight position={[-2.5, 1.5, 1.2]} intensity={0.35} color="#d6e4ff" />
      {/* rim */}
      <directionalLight position={[0.2, 1.2, -2.4]} intensity={0.55} color="#ffd9b0" />
      <hemisphereLight args={['#fff8f0', '#c4b29a', 0.35]} />
    </>
  )
}
