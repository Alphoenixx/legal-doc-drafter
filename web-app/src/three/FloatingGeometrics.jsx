import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Floating wireframe polyhedra that slowly drift with mouse-reactive parallax.
 * Used across landing page and dashboard backgrounds.
 */
export default function FloatingGeometrics({ count = 6, spread = 8, mouseInfluence = 0.3 }) {
  const groupRef = useRef();

  const items = useMemo(() => {
    const geometries = [
      new THREE.IcosahedronGeometry(0.4, 0),
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.TetrahedronGeometry(0.4, 0),
      new THREE.DodecahedronGeometry(0.3, 0),
    ];

    return Array.from({ length: count }, (_, i) => ({
      geometry: geometries[i % geometries.length],
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * (spread * 0.6),
        (Math.random() - 0.5) * 4 - 2,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      speed: 0.1 + Math.random() * 0.15,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatAmplitude: 0.3 + Math.random() * 0.5,
      opacity: 0.08 + Math.random() * 0.1,
      scale: 0.6 + Math.random() * 0.8,
    }));
  }, [count, spread]);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((mesh, i) => {
      const item = items[i];
      if (!item) return;

      // Slow rotation
      mesh.rotation.x = item.rotation[0] + t * item.speed * 0.5;
      mesh.rotation.y = item.rotation[1] + t * item.speed;

      // Floating up/down
      mesh.position.y = item.position[1] + Math.sin(t * item.floatSpeed) * item.floatAmplitude;

      // Mouse parallax (depth-based)
      const depthFactor = 1 + (mesh.position.z + 4) * 0.15;
      mesh.position.x = item.position[0] + pointer.x * mouseInfluence * depthFactor;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <mesh
          key={i}
          geometry={item.geometry}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          <meshBasicMaterial
            color="#12d6c5"
            wireframe
            transparent
            opacity={item.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
