/// <reference types="vite/client" />

// GLB 파일 타입 선언
declare module '*.glb' {
  const src: string;
  export default src;
}

// meshline 라이브러리 타입 선언
declare module 'meshline' {
  import { BufferGeometry, ShaderMaterial } from 'three';
  
  export class MeshLineGeometry extends BufferGeometry {
    constructor();
  }
  
  export class MeshLineMaterial extends ShaderMaterial {
    constructor(parameters?: any);
  }
}

// React Three Fiber를 위한 JSX 확장
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}