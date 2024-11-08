import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { RenderModel } from './RenderModel';
import * as THREE from 'three';

interface JewelryRenderProps {
  modelUrl: string;
  isRendering: boolean;
  independentZoom?: boolean;
}

export function JewelryRender({ modelUrl, isRendering, independentZoom = false }: JewelryRenderProps) {
  const [selectedMetal, setSelectedMetal] = useState('22kt Gold');

  const metalOptions = {
    '22kt Gold': {
      color: new THREE.Color('#FFD700'),
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: 1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      normalScale: new THREE.Vector2(0.1, 0.1),
      ior: 1.5,
      reflectivity: 0.7,
      transmission: 0,
      specularIntensity: 0.8,
      specularColor: new THREE.Color('#FFD700'),
      thickness: 0
    },
    'Rose Gold': {
      color: new THREE.Color('#B76E79'),
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: 1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      normalScale: new THREE.Vector2(0.1, 0.1),
      ior: 1.5,
      reflectivity: 0.7,
      transmission: 0,
      specularIntensity: 0.8,
      specularColor: new THREE.Color('#B76E79'),
      thickness: 0
    },
    'White Gold': {
      color: new THREE.Color('#F5F5F5'),
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: 1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      normalScale: new THREE.Vector2(0.1, 0.1),
      ior: 1.5,
      reflectivity: 0.7,
      transmission: 0,
      specularIntensity: 0.8,
      specularColor: new THREE.Color('#F5F5F5'),
      thickness: 0
    },
    'Platinum': {
      color: new THREE.Color('#E5E4E2'),
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: 1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      normalScale: new THREE.Vector2(0.1, 0.1),
      ior: 1.5,
      reflectivity: 0.7,
      transmission: 0,
      specularIntensity: 0.8,
      specularColor: new THREE.Color('#E5E4E2'),
      thickness: 0
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-10">
        <select
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setSelectedMetal(e.target.value)}
          value={selectedMetal}
        >
          {Object.keys(metalOptions).map((metal) => (
            <option key={metal} value={metal}>
              {metal}
            </option>
          ))}
        </select>
      </div>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 150], fov: 45 }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <color attach="background" args={['#ffffff']} />
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <spotLight
            position={[100, 100, 100]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <RenderModel
            url={modelUrl}
            materialProps={metalOptions[selectedMetal as keyof typeof metalOptions]}
          />
          <Environment preset="studio" intensity={1} />
        </Suspense>
        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minDistance={50}
          maxDistance={400}
          rotateSpeed={1}
          zoomSpeed={1.2}
          panSpeed={1}
        />
      </Canvas>
    </div>
  );
}