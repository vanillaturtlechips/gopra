import { useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, RapierRigidBody } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'

// ⚠️ 에셋 파일이 실제로 존재하는지 꼭 확인해주세요!
import cardGLB from '../assets/lanyard/card.glb' 
import lanyardTexture from '../assets/lanyard/lanyard.png'

extend({ MeshLineGeometry, MeshLineMaterial })

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  onCardDoubleClick?: () => void;
}

export default function Lanyard({ 
  position = [0, 0, 30], 
  gravity = [0, -40, 0], 
  fov = 20, 
  transparent = true,
  onCardDoubleClick 
}: LanyardProps) {
  return (
    <div className="lanyard-wrapper" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10 }}>
      <Canvas 
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={gravity as [number, number, number]} timeStep={1 / 60}>
          <Band onCardDoubleClick={onCardDoubleClick} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

function Band({ onCardDoubleClick }: { onCardDoubleClick?: () => void }) {
  // unused variable 'materials' removed
  const { nodes } = useGLTF(cardGLB) as any
  const texture = useTexture(lanyardTexture)
  const { width, height } = useThree((state) => state.size)
  
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)

  // ❗️ Fix: null!을 사용하여 초기값은 null이지만 타입은 RapierRigidBody임을 명시
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ])
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const vec = new THREE.Vector3()
  const dir = new THREE.Vector3()

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  // unused variable 'delta' removed from parameters
  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current) {
      // Fix: unused variable 'y' removed/inlined
      // Calculate y position dynamically based on aspect ratio to keep it at top
      fixed.current.setNextKinematicTranslation({ x: 0, y: (height / width) * 2.5 + 1.5, z: 0 })
    }
  })

  const lineRef = useRef<any>(null)
  useFrame(() => {
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.translation())
      curve.points[2].copy(j1.current.translation())
      curve.points[3].copy(fixed.current.translation())
      if (lineRef.current) lineRef.current.advance(curve.getPoints(50))
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} type="kinematicPosition" position={[0, 0, 0]} colliders={false}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.5, 0, 0]} ref={j1} colliders={false} linearDamping={4} angularDamping={4}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} colliders={false} linearDamping={4} angularDamping={4}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} colliders={false} linearDamping={4} angularDamping={4}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        
        <RigidBody 
          ref={card} 
          type={dragged ? 'kinematicPosition' : 'dynamic'} 
          colliders={false} 
          linearDamping={2} 
          angularDamping={2}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerDown={(e) => {
              // @ts-ignore
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))
            }}
            onPointerUp={(e) => {
              // @ts-ignore
              e.target.releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (onCardDoubleClick) onCardDoubleClick();
            }}
            // ❗️ Fix: style prop removed from <group>
            // 대신 마우스 오버 시 커서 변경 로직 추가
            onPointerOver={() => { document.body.style.cursor = 'grab'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <primitive object={nodes.card} />
          </group>
        </RigidBody>
      </group>
      
      <mesh ref={lineRef}>
        <meshLineGeometry />
        <meshLineMaterial 
          transparent 
          lineWidth={0.3} 
          color={'white'} 
          depthTest={false} 
          resolution={[width, height]} 
          useMap={1} 
          map={texture} 
          repeat={[-3, 1]} 
        />
      </mesh>
    </>
  )
}