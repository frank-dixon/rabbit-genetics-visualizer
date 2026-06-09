import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGeneticStore } from '../store/useGeneticStore';

interface MeshProps {
  chromosomeNumber: number;
  position: [number, number, number];
  isFocused?: boolean;
  isDark?: boolean;
}

const COLORS = {
  light: {
    idleCentromere: '#94a3b8',
    idleArm: '#64748b',
    active: '#0ea5e9',
    activeCentromere: '#0284c7',
    emissive: '#38bdf8',
  },
  dark: {
    idleCentromere: '#64748b',
    idleArm: '#475569',
    active: '#38bdf8',
    activeCentromere: '#0ea5e9',
    emissive: '#7dd3fc',
  },
} as const;

export function ChromosomeMesh({
  chromosomeNumber,
  position,
  isFocused = false,
  isDark = false,
}: MeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const hoveredChromosome = useGeneticStore((state) => state.hoveredChromosome);
  const setHoveredChromosome = useGeneticStore((state) => state.setHoveredChromosome);

  const palette = isDark ? COLORS.dark : COLORS.light;
  const isHovered = hoveredChromosome === chromosomeNumber;
  const isActive = isFocused || isHovered;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * (isFocused ? 0.5 : 0.3);
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.getElapsedTime() + chromosomeNumber) * 0.1;
      meshRef.current.scale.setScalar(isFocused ? 1.15 : 1);
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredChromosome(chromosomeNumber);
      }}
      onPointerOut={() => setHoveredChromosome(null)}
    >
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? palette.activeCentromere : palette.idleCentromere}
          emissive={isFocused ? palette.emissive : '#000000'}
          emissiveIntensity={isFocused ? 0.35 : 0}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2.5, 16]} />
        <meshStandardMaterial
          color={isActive ? palette.active : palette.idleArm}
          emissive={isFocused ? palette.emissive : '#000000'}
          emissiveIntensity={isFocused ? 0.25 : 0}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2.5, 16]} />
        <meshStandardMaterial
          color={isActive ? palette.active : palette.idleArm}
          emissive={isFocused ? palette.emissive : '#000000'}
          emissiveIntensity={isFocused ? 0.25 : 0}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}
