import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const views = {
  Front: [0, 0, 4.2],
  Back: [0, 0, -4.2],
  Left: [-4.2, 0, 0],
  Right: [4.2, 0, 0],
  Top: [0, 4.2, 0.01],
}

function PlaceholderCharacter() {
  const group = useRef()
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.position.y = Math.sin(t * 1.25) * 0.035
    group.current.rotation.y = Math.sin(t * 0.35) * 0.07
  })

  return (
    <group ref={group} position={[0, -1.05, 0]}>
      <mesh position={[0, 1.48, 0]} castShadow>
        <capsuleGeometry args={[0.36, 0.82, 8, 16]} />
        <meshStandardMaterial color="#a9a7a2" roughness={0.72} />
      </mesh>
      <mesh position={[0, 2.12, 0]} castShadow>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial color="#c7c3bc" roughness={0.68} />
      </mesh>
      <mesh position={[-0.48, 1.48, 0]} rotation={[0, 0, -0.13]} castShadow>
        <capsuleGeometry args={[0.105, 0.72, 6, 12]} />
        <meshStandardMaterial color="#898783" roughness={0.75} />
      </mesh>
      <mesh position={[0.48, 1.48, 0]} rotation={[0, 0, 0.13]} castShadow>
        <capsuleGeometry args={[0.105, 0.72, 6, 12]} />
        <meshStandardMaterial color="#898783" roughness={0.75} />
      </mesh>
      <mesh position={[-0.19, 0.48, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.72, 6, 12]} />
        <meshStandardMaterial color="#777672" roughness={0.78} />
      </mesh>
      <mesh position={[0.19, 0.48, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.72, 6, 12]} />
        <meshStandardMaterial color="#777672" roughness={0.78} />
      </mesh>
    </group>
  )
}

export default function CharacterStage({ onInteract }) {
  const controls = useRef()
  const [activeView, setActiveView] = useState('Front')

  const changeView = (name) => {
    setActiveView(name)
    onInteract?.()
    const [x, y, z] = views[name]
    if (controls.current) {
      controls.current.object.position.set(x, y, z)
      controls.current.target.set(0, 0.8, 0)
      controls.current.update()
    }
  }

  return (
    <div className="character-stage">
      <div className="stage-label"><span className="live-dot" /> 3D MODEL / PREVIEW</div>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 38 }} shadows dpr={[1, 1.6]}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} castShadow />
        <pointLight position={[-3, 1, -2]} intensity={1.2} color="#a8b9ff" />
        <PlaceholderCharacter />
        <ContactShadows position={[0, -1.08, 0]} opacity={0.35} scale={5} blur={2.5} />
        <Environment preset="city" />
        <OrbitControls ref={controls} target={[0, 0.8, 0]} enablePan={false} minDistance={2.6} maxDistance={7} />
      </Canvas>
      <div className="view-controls" aria-label="Character camera angles">
        {Object.keys(views).map((view) => (
          <button key={view} className={activeView === view ? 'active' : ''} onClick={() => changeView(view)}>{view}</button>
        ))}
      </div>
      <p className="stage-hint">DRAG TO ROTATE · SCROLL TO ZOOM</p>
    </div>
  )
}
