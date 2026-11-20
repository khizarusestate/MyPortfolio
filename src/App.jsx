import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = 'https://grab3d.com/dl/human-head/human-head-light.glb'

function HumanHead() {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL)
  const { viewport } = useThree()

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(clone)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())

    clone.position.set(-center.x, -bounds.min.y, -center.z)

    return {
      scene: clone,
      width: size.x,
      height: size.y,
    }
  }, [scene])

  const scale = Math.min(
    (viewport.height * 0.94) / model.height,
    (viewport.width * 0.9) / model.width,
  )

  useFrame(({ clock }) => {
    if (!group.current) return

    const time = clock.elapsedTime
    const breathing = Math.sin(time * 1.15) * 0.018

    group.current.position.y = -0.08 + breathing
    group.current.rotation.y = Math.sin(time * 0.22) * 0.025
    group.current.rotation.x = Math.sin(time * 1.15) * 0.008
    group.current.scale.setScalar(scale * (1 + breathing * 0.12))
  })

  return (
    <group ref={group} position={[0, -0.08, 0]}>
      <primitive object={model.scene} />
    </group>
  )
}

function ModelScene() {
  return (
    <Canvas
      className="human-canvas"
      orthographic
      camera={{ position: [0, 0.14, 5], zoom: 1, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[-2.5, 3.5, 4]} intensity={2.4} />
      <directionalLight position={[3, 0.5, -2]} intensity={1.1} />
      <Suspense fallback={null}>
        <HumanHead />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)

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
