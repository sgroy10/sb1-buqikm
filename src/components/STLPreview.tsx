import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage, ContactShadows } from '@react-three/drei';
import { Model } from './Model';

interface STLPreviewProps {
  modelUrl: string;
  independentZoom?: boolean;
}

const materialPresets = {
  'Dark Green': {
    color: '#006400',
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.5,
    reflectivity: 0.8,
    transmission: 0,
    ior: 1.5,
    thickness: 0
  },
  'Dark Blue': {
    color: '#00008B',
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.5,
    reflectivity: 0.8,
    transmission: 0,
    ior: 1.5,
    thickness: 0
  },
  'Dark Pink': {
    color: '#8B1C62',
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.5,
    reflectivity: 0.8,
    transmission: 0,
    ior: 1.5,
    thickness: 0
  },
  'Dark Orange': {
    color: '#8B4500',
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.5,
    reflectivity: 0.8,
    transmission: 0,
    ior: 1.5,
    thickness: 0
  },
  'Dark Red': {
    color: '#8B0000',
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.5,
    reflectivity: 0.8,
    transmission: 0,
    ior: 1.5,
    thickness: 0
  },
  'Violet': {
    color: '#8A2BE2',
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.5,
    reflectivity: 0.8,
    transmission: 0,
    ior: 1.5,
    thickness: 0
  },
  'Mustard': {
    color: '#FFD700',
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.5,
    reflectivity: 0.8,
    transmission: 0,
    ior: 1.5,
    thickness: 0
  }
};

export function STLPreview({ modelUrl, independentZoom = false }: STLPreviewProps) {
  const [selectedMaterial, setSelectedMaterial] = useState('Dark Green');

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-10">
        <select
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setSelectedMaterial(e.target.value)}
          value={selectedMaterial}
        >
          {Object.keys(materialPresets).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [75, 75, 75], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: 3, // ACESFilmicToneMapping
          toneMappingExposure: 1.5
        }}
      >
        <color attach="background" args={['#ffffff']} />
        <Suspense fallback={null}>
          <Stage
            intensity={2}
            environment="studio"
            adjustCamera={false}
            shadows="contact"
            preset="rembrandt"
            ambience={0.7}
          >
            <Model url={modelUrl} materialProps={materialPresets[selectedMaterial as keyof typeof materialPresets]} />
          </Stage>
          <Environment preset="studio" intensity={2.5} />
          <ambientLight intensity={0.8} />
          <spotLight
            position={[100, 100, 100]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <spotLight
            position={[-100, -100, -100]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-50, 50, -50]} intensity={0.8} />
          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={10}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={50}
          maxDistance={500}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}