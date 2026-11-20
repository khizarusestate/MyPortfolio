import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL =
  'https://cdn.jsdelivr.net/gh/memoriesrohit/avatar-studio@main/models/daniel_formal.glb'

function Character({ onLoaded }) {
  const group = useRef()
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return
      object.castShadow = false
      object.receiveShadow = false

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      materials.forEach((material) => {
        if (!material) return
        material.envMapIntensity = 0.7
        material.needsUpdate = true
      })
    })

    const idle = actions.Idle ?? Object.values(actions)[0]
    idle?.reset().fadeIn(0.5).play()
    onLoaded()

    return () => idle?.fadeOut(0.2)
  }, [actions, onLoaded, scene])

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.position.y = -0.065 + Math.sin(clock.elapsedTime * 0.9) * 0.002
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.006
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

function ModelScene({ onLoaded }) {
  return (
    <Canvas
      className="human-canvas"
      camera={{ position: [0, 1.43, 1.05], fov: 15.5, near: 0.01, far: 20 }}
      dpr={[1, 1.35]}
      shadows={false}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.75} />
      <hemisphereLight skyColor="#dce8ff" groundColor="#17111a" intensity={0.65} />
      <directionalLight position={[-2.5, 4, 4]} intensity={1.8} color="#fff0e5" />
      <directionalLight position={[3, 1.5, 2]} intensity={0.65} color="#8eafff" />
      <Suspense fallback={null}>
        <Character onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)

export default function App() {
  const handleModelLoaded = () => {
    document.querySelector('.welcome-screen')?.classList.add('is-ready')
  }

  return (
    <main className="welcome-screen">
      <div className="model-background" aria-hidden="true">
        <ModelScene onLoaded={handleModelLoaded} />
      </div>
      <div className="welcome-overlay">
        <div className="welcome-copy">
          <div className="tech-icons" aria-label="React, Node.js, MongoDB and VPS hosting">
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
            <svg className="tech-icon vps-icon" viewBox="0 0 48 48" role="img" aria-label="VPS hosting">
              <rect x="7" y="5" width="34" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <rect x="7" y="22" width="34" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <circle cx="13" cy="11.5" r="1.5" fill="currentColor" />
              <circle cx="13" cy="28.5" r="1.5" fill="currentColor" />
              <path d="M19 11.5h16M19 28.5h16M18 42h12M24 35v7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="welcome-text">Press Enter to Continue</h1>
        </div>
        <p className="copyright-text">© 2026 | All Rights Reserved.</p>
      </div>
    </main>
  )
}
