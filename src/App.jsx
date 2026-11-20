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
      camera={{ position: [0, 1.43, 1.05], fov: 20.5, near: 0.01, far: 20 }}
      onCreated={({ camera }) => camera.lookAt(0, 1.55, 0)}
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
      <ambientLight intensity={0.68} />
      <hemisphereLight skyColor="#dce8ff" groundColor="#17111a" intensity={0.72} />
      <directionalLight position={[-2.5, 4, 4]} intensity={1.65} color="#fff0e5" />
      <directionalLight position={[3, 1.5, 2]} intensity={0.55} color="#8eafff" />
      <pointLight position={[-1.35, 2.65, -1.7]} intensity={2.1} color="#527cff" distance={5} decay={2} />
      <pointLight position={[1.5, 2.2, -1.4]} intensity={1.15} color="#8c9dff" distance={4.5} decay={2} />
      <Suspense fallback={null}>
        <Character onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)

function TechIcon({ name, className, children }) {
  return (
    <div className={`tech-item ${className}`}>
      <span className="icon-star" aria-hidden="true" />
      <svg className="tech-icon" viewBox="0 0 48 48" role="img" aria-label={name}>
        {children}
      </svg>
    </div>
  )
}

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
          <div className="tech-icons" aria-label="MongoDB, Node.js, React, VPS hosting and GitHub">
            <TechIcon name="MongoDB" className="mongo-item">
              <path d="M24 4.5c-1.8 6.3-10.4 11.2-10.4 22.1 0 7.7 4.2 12.7 9 14.4l1.4 3.1 1.4-3.1c4.8-1.7 9-6.7 9-14.4C34.4 15.7 25.8 10.8 24 4.5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M24 13v28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </TechIcon>
            <TechIcon name="Node.js" className="node-item">
              <path d="M24 3.8 42 14.2v19.6L24 44.2 6 33.8V14.2L24 3.8Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
              <text x="24" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">node</text>
              <text x="24" y="35" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="currentColor">JS</text>
            </TechIcon>
            <TechIcon name="React" className="react-item">
              <circle cx="24" cy="24" r="3.2" fill="currentColor" />
              <g fill="none" stroke="currentColor" strokeWidth="1.8">
                <ellipse cx="24" cy="24" rx="20" ry="7.8" />
                <ellipse cx="24" cy="24" rx="20" ry="7.8" transform="rotate(60 24 24)" />
                <ellipse cx="24" cy="24" rx="20" ry="7.8" transform="rotate(120 24 24)" />
              </g>
            </TechIcon>
            <TechIcon name="VPS hosting" className="vps-item">
              <rect x="7" y="5" width="34" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <rect x="7" y="22" width="34" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <circle cx="13" cy="11.5" r="1.5" fill="currentColor" />
              <circle cx="13" cy="28.5" r="1.5" fill="currentColor" />
              <path d="M19 11.5h16M19 28.5h16M18 42h12M24 35v7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </TechIcon>
            <TechIcon name="GitHub" className="github-item">
              <path fill="currentColor" d="M24 4.5a19.5 19.5 0 0 0-6.17 38c.98.18 1.33-.42 1.33-.94v-3.3c-5.42 1.18-6.56-2.3-6.56-2.3-.89-2.26-2.17-2.86-2.17-2.86-1.77-1.21.13-1.19.13-1.19 1.96.14 2.99 2.01 2.99 2.01 1.74 2.98 4.57 2.12 5.68 1.62.18-1.26.68-2.12 1.24-2.61-4.33-.49-8.88-2.17-8.88-9.65 0-2.13.76-3.87 2.01-5.24-.2-.49-.87-2.48.19-5.17 0 0 1.64-.52 5.36 2a18.6 18.6 0 0 1 9.76 0c3.72-2.52 5.35-2 5.35-2 1.07 2.69.4 4.68.2 5.17 1.25 1.37 2 3.11 2 5.24 0 7.5-4.56 9.15-8.91 9.63.7.61 1.32 1.8 1.32 3.63v5.02c0 .52.35 1.13 1.34.94A19.5 19.5 0 0 0 24 4.5Z" />
            </TechIcon>
          </div>
          <h1 className="welcome-text">Press Enter to Continue</h1>
        </div>
        <p className="copyright-text">© 2026 | All Rights Reserved.</p>
      </div>
    </main>
  )
}
