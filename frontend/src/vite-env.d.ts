/// <reference types="vite/client" />

// 에셋 파일 타입
declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.gltf' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

// meshline 라이브러리 타입 - 정확한 export 구조
declare module 'meshline' {
  import { BufferGeometry, ShaderMaterial } from 'three'
  
  export class MeshLine extends BufferGeometry {
    constructor()
    setPoints(points: number[] | Float32Array | THREE.Vector3[]): void
    advance(points: THREE.Vector3[]): void
  }
  
  export class MeshLineGeometry extends BufferGeometry {
    constructor()
  }
  
  export class MeshLineMaterial extends ShaderMaterial {
    constructor(parameters?: any)
  }
}

// React Three Fiber JSX 타입 확장
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLine: any
    meshLineGeometry: any
    meshLineMaterial: any
  }
}

export {}