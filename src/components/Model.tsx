import { useRef, useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

interface MaterialProps {
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  envMapIntensity: number;
  reflectivity: number;
  transmission: number;
  ior: number;
  thickness: number;
}

interface ModelProps {
  url: string;
  materialProps: MaterialProps;
}

export function Model({ url, materialProps }: ModelProps) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (meshRef.current && geometry) {
      // Center geometry
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox?.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);

      // Scale model to reasonable size
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 50 / maxDim;
      meshRef.current.scale.setScalar(scale);

      // Position camera to view entire model
      camera.position.set(75, 75, 75);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [geometry, camera]);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        {...materialProps}
        color={new THREE.Color(materialProps.color)}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}