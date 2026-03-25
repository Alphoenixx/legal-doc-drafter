import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FloatingGeometrics from './FloatingGeometrics';

function NetworkNodes({ count = 50 }) {
  const mesh = useRef();
  const lines = useRef();

  const { positions, basePositions, colors, connections } = useMemo(() => {
    const pos = [];
    const col = [];
    const conn = [];

    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 7
      );
      // Accent-tinted node colors with slight variation
      const r = 0.06 + Math.random() * 0.06;
      const g = 0.78 + Math.random() * 0.15;
      const b = 0.68 + Math.random() * 0.15;
      col.push(r, g, b);
    }

    // Create connections between nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3.5) {
          conn.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      basePositions: [...pos],
      colors: new Float32Array(col),
      connections: new Float32Array(conn),
    };
  }, [count]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();

    if (mesh.current) {
      // Slow rotation orbit
      mesh.current.rotation.y = t * 0.025;
      mesh.current.rotation.x = Math.sin(t * 0.015) * 0.08;

      // Breathing: subtle position oscillation
      const posAttr = mesh.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const bz = basePositions[i * 3 + 2];
        posAttr.setXYZ(
          i,
          bx + Math.sin(t * 0.5 + i * 0.7) * 0.08,
          by + Math.cos(t * 0.4 + i * 0.5) * 0.06,
          bz + Math.sin(t * 0.3 + i * 0.3) * 0.05
        );
      }
      posAttr.needsUpdate = true;

      // Mouse parallax
      mesh.current.position.x = pointer.x * 0.3;
      mesh.current.position.y = pointer.y * 0.15;
    }

    if (lines.current) {
      lines.current.rotation.y = t * 0.025;
      lines.current.rotation.x = Math.sin(t * 0.015) * 0.08;
      lines.current.position.x = pointer.x * 0.3;
      lines.current.position.y = pointer.y * 0.15;

      // Pulsing connection opacity
      lines.current.material.opacity = 0.1 + Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#12d6c5"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function LegalNetworkScene({ style, className, showGeometrics = true }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }} className={className}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <NetworkNodes />
        {showGeometrics && <FloatingGeometrics count={5} spread={10} mouseInfluence={0.4} />}
      </Canvas>
    </div>
  );
}
