import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NetworkNodes({ count = 40 }) {
  const mesh = useRef();
  const lines = useRef();

  const { positions, colors, connections } = useMemo(() => {
    const pos = [];
    const col = [];
    const conn = [];

    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      const r = 0.07 + Math.random() * 0.05;
      const g = 0.82 + Math.random() * 0.1;
      const b = 0.72 + Math.random() * 0.1;
      col.push(r, g, b);
    }

    // Create connections between nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3.0) {
          conn.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
      connections: new Float32Array(conn),
    };
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
    if (lines.current) {
      lines.current.rotation.y = state.clock.elapsedTime * 0.03;
      lines.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <group>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>

      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#12d6c5" transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

export default function LegalNetworkScene({ style, className }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }} className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <NetworkNodes />
      </Canvas>
    </div>
  );
}
