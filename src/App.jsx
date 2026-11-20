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
    camera.lookAt(0, 1.55, 0)
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
        <div className="welcome-copy">
          <div className="tech-icons" aria-label="React, Node.js and MongoDB">
          <svg className="tech-icon react-icon" viewBox="0 0 48 48" role="img" aria-label="React">
            <circle cx="24" cy="24" r="3.2" fill="currentColor" />
            <g fill="none" stroke="currentColor" strokeWidth="1.8">
              <ellipse cx="24" cy="24" rx="20" ry="7.8" />
              <ellipse cx="24" cy="24" rx="20" ry="7.8" transform="rotate(60 24 24)" />
              <ellipse cx="24" cy="24" rx="20" ry="7.8" transform="rotate(120 24 24)" />
            </g>
          </svg>
          <svg className="tech-icon node-icon" viewBox="0 0 48 48" role="img" aria-label="Node.js">
            <path d="M24 3.8 42 14.2v19.6L24 44.2 6 33.8V14.2L24 3.8Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
            <text x="24" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">node</text>
            <text x="24" y="35" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="currentColor">JS</text>
          </svg>
          <svg className="tech-icon mongo-icon" viewBox="0 0 48 48" role="img" aria-label="MongoDB">
            <path d="M24 4.5c-1.8 6.3-10.4 11.2-10.4 22.1 0 7.7 4.2 12.7 9 14.4l1.4 3.1 1.4-3.1c4.8-1.7 9-6.7 9-14.4C34.4 15.7 25.8 10.8 24 4.5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M24 13v28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
          <h1 className="welcome-text">Press Enter to Continue</h1>
        </div>
        <p className="copyright-text">© 2026 Khizar Hayat<br />All Rights Reserved.</p>
      </div>
    </main>
  )
}
