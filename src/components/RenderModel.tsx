import { useRef, useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

interface RenderModelProps {
  url: string;
  materialProps: {
    color: THREE.Color;
    metalness: number;
    roughness: number;
    envMapIntensity: number;
    clearcoat: number;
    clearcoatRoughness: number;
    normalScale: THREE.Vector2;
    ior: number;
    reflectivity: number;
    transmission: number;
    specularIntensity: number;
    specularColor: THREE.Color;
    thickness: number;
  };
}

export function RenderModel({ url, materialProps }: RenderModelProps) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (meshRef.current && geometry) {
      geometry.center();
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 100 / maxDim;
      meshRef.current.scale.setScalar(scale);

      const center = new THREE.Vector3();
      box.getCenter(center);
      camera.position.set(200, 200, 200);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
    }
  }, [geometry, camera]);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial 
        {...materialProps}
        side={THREE.DoubleSide}
        transparent={false}
        depthWrite={true}
        polygonOffset={true}
        polygonOffsetFactor={1}
        flatShading={false}
      />
    </mesh>
  );
}