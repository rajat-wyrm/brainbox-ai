import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';

const AnimatedSphere = () => {
  const sphereRef = useRef();
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.2}>
      <MeshDistortMaterial
        color="#3b82f6"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive="#1e40af"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
};

export const Brain3D = () => {
  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-900 to-purple-900">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} color="#8b5cf6" />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
};

export const FloatingBrain = ({ className }) => {
  return (
    <div className={className || "w-20 h-20"}>
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Sphere args={[1, 32, 32]}>
          <MeshDistortMaterial
            color="#6366f1"
            distort={0.2}
            speed={1.5}
            roughness={0.3}
            metalness={0.7}
          />
        </Sphere>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
};
