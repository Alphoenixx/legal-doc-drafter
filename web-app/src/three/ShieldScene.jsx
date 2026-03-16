import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Shield() {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      // Mouse-reactive tilt
      meshRef.current.rotation.z = pointer.x * 0.15;
      meshRef.current.rotation.x += pointer.y * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -t * 0.08;
      glowRef.current.rotation.x = Math.cos(t * 0.2) * 0.05;
    }
  });

  return (
    <group>
      {/* Main wireframe shield */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial
          color="#12d6c5"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Inner glow sphere */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial
          color="#12d6c5"
          transparent
          opacity={0.08}
        />
      </mesh>
      {/* Core dot */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#1de9d0" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function ShieldScene() {
  return (
    <div style={{ width: 64, height: 64, margin: '0 auto 12px' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Shield />
      </Canvas>
    </div>
  );
}
