import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import * as THREE from 'three'

const MODEL_URL =
  'https://cdn.jsdelivr.net/npm/open-anatomy-3d@0.1.0/models/anatomy-male.glb'

function HumanHead() {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL, true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder)
  })

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(clone)
    const center = bounds.getCenter(new THREE.Vector3())
    clone.position.x -= center.x
    clone.position.z -= center.z
    return clone
  }, [scene])

  useFrame(({ clock }) => {
    if (!group.current) return
    const time = clock.elapsedTime
    const breath = Math.sin(time * 1.05) * 0.009
    group.current.position.y = breath
    group.current.rotation.y = Math.sin(time * 0.2) * 0.012
    group.current.rotation.x = Math.sin(time * 1.05) * 0.004
  })

  return (
    <group ref={group}>
      <primitive object={model} />
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
      <ambientLight intensity={1.1} />
      <directionalLight position={[-1.5, 2.8, 3]} intensity={2.1} />
      <directionalLight position={[2.5, 1.2, -2]} intensity={1.4} />
      <pointLight position={[0, 1.8, 2]} intensity={0.35} color="#ffb7a8" />
    </>
  )
}

function ModelScene() {
  return (
    <Canvas
      className="human-canvas"
      camera={{ position: [0, 1.43, 1.05], fov: 34.4, near: 0.01, far: 20 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#000000']} />
      <SceneLighting />
      <CameraAim />
      <Suspense fallback={null}>
        <HumanHead />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL, true, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder)
})

export default function App() {
  return (
    <main className="welcome-screen">
      <div className="model-background" aria-hidden="true">
        <ModelScene />
      </div>
      <div className="welcome-overlay">
        <h1 className="welcome-text">Press Enter to Continue</h1>
        <p className="copyright-text">© 2026 All Rights Reserved.</p>
      </div>
    </main>
  )
}
