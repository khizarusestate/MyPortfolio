import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'

const MODEL_URL =
  'https://cdn.jsdelivr.net/gh/memoriesrohit/avatar-studio@main/models/daniel_formal.glb'

function HumanCharacter({ onLoaded }) {
  const group = useRef()
  // The component mounts only after the GLB and its required assets are ready.
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const idle = actions.Idle ?? Object.values(actions)[0]
    idle?.reset().fadeIn(0.7).play()
    onLoaded()

    return () => {
      idle?.fadeOut(0.3)
    }
  }, [actions, onLoaded])

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.position.y = -0.065 + Math.sin(clock.elapsedTime * 1.05) * 0.002
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

function CameraAim() {
  useFrame(({ camera }) => {
    camera.lookAt(0, 1.38, 0)
  })
  return null
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[-1.5, 2.8, 3]} intensity={2.0} />
      <directionalLight position={[2.5, 1.2, -2]} intensity={1.25} />
      <pointLight position={[0, 1.8, 2]} intensity={0.3} color="#ffe0d0" />
    </>
  )
}

function ModelScene({ onLoaded }) {
  return (
    <Canvas
      className="human-canvas"
      camera={{ position: [0, 1.43, 1.05], fov: 20.5, near: 0.01, far: 20 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#000000']} />
      <SceneLighting />
      <CameraAim />
      <Suspense fallback={null}>
        <HumanCharacter onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)

export default function App() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const handleModelLoaded = () => setModelLoaded(true)

  return (
    <main className={`welcome-screen${modelLoaded ? ' is-ready' : ''}`}>
      <div className="model-background" aria-hidden="true">
        <ModelScene onLoaded={handleModelLoaded} />
      </div>
      <div className="welcome-overlay">
        <h1 className="welcome-text">Press Enter to Continue</h1>
        <p className="copyright-text">© 2026 All Rights Reserved.</p>
      </div>
    </main>
  )
}
