import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 5000 }) => {
  const points = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x += delta * 0.02;
      points.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4f46e5"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const FloatingBrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#6366f1"
        emissive="#312e81"
        wireframe
        transparent
        opacity={0.3}
        distort={0.4}
        speed={2}
      />
    </Sphere>
  );
};

const EnergyRings = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[3.5, 0.1, 16, 100]} />
      <meshStandardMaterial color="#8b5cf6" emissive="#4c1d95" emissiveIntensity={2} wireframe />
    </mesh>
  );
};

export const GalaxyBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900">
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.5} />
        <FloatingBrain />
        <EnergyRings />
        <ParticleField count={3000} />
      </Canvas>
    </div>
  );
};

export const ParticleBackground = ({ children }) => {
  return (
    <div className="relative">
      <GalaxyBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
