import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

interface RenderViewProps {
  file: File | null;
  modelUrl: string;
}

const MaterialSelector = ({ onChange }: { onChange: (material: string) => void }) => (
  <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg z-10">
    <select 
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-3 py-2 text-sm border rounded-md"
    >
      <option value="gold">Yellow Gold</option>
      <option value="rose-gold">Rose Gold</option>
      <option value="white-gold">White Gold</option>
      <option value="platinum">Platinum</option>
      <option value="silver">Silver</option>
    </select>
  </div>
);

interface RenderModelProps {
  url: string;
  materialProps: any;
}

const RenderModel: React.FC<RenderModelProps> = ({ url, materialProps }) => {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} geometry={geometry} scale={[0.1, 0.1, 0.1]}>
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
};

const RenderView: React.FC<RenderViewProps> = ({ modelUrl }) => {
  const [material, setMaterial] = useState('gold');

  const getMaterialProps = (materialType: string) => {
    switch (materialType) {
      case 'gold':
        return {
          color: '#FFD700',
          metalness: 1,
          roughness: 0.1,
          envMapIntensity: 2,
        };
      case 'rose-gold':
        return {
          color: '#B76E79',
          metalness: 1,
          roughness: 0.1,
          envMapIntensity: 2,
        };
      case 'white-gold':
        return {
          color: '#E8E8E8',
          metalness: 1,
          roughness: 0.1,
          envMapIntensity: 2,
        };
      case 'platinum':
        return {
          color: '#E5E4E2',
          metalness: 1,
          roughness: 0.15,
          envMapIntensity: 2,
        };
      case 'silver':
        return {
          color: '#C0C0C0',
          metalness: 1,
          roughness: 0.2,
          envMapIntensity: 2,
        };
      default:
        return {
          color: '#FFD700',
          metalness: 1,
          roughness: 0.1,
          envMapIntensity: 2,
        };
    }
  };

  return (
    <>
      <MaterialSelector onChange={setMaterial} />
      <Canvas camera={{ position: [100, 100, 100], fov: 45 }}>
        <color attach="background" args={['#f8f8f8']} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <AccumulativeShadows temporal frames={60} alphaTest={0.85} scale={10}>
            <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 5, -10]} />
          </AccumulativeShadows>
          <RenderModel url={modelUrl} materialProps={getMaterialProps(material)} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </>
  );
};

export default RenderView;