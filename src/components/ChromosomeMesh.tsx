import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getChromosomeLabel,
  getLocusBandsForChromosome,
  LOCUS_BAND_COLORS,
  type LocusBandPlacement,
} from '../data/rabbitGenetics';
import { useGeneticStore } from '../store/useGeneticStore';

interface MeshProps {
  chromosomeNumber: number;
  position: [number, number, number];
  isFocused?: boolean;
  isDark?: boolean;
  selectedLocusId?: string | null;
}

const ARM_LENGTH = 2.5;
const ARM_RADIUS = 0.2;
const ARM_CENTER_OFFSET = 1.5;
const ARM_INNER_EDGE = ARM_CENTER_OFFSET - ARM_LENGTH / 2;

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

function bandArmY({ arm, armPosition }: LocusBandPlacement): number {
  const sign = arm === 'p' ? 1 : -1;
  return sign * (ARM_INNER_EDGE + armPosition * ARM_LENGTH);
}

interface LocusBandProps {
  band: LocusBandPlacement;
  isSelected: boolean;
  isDimmed: boolean;
  isDark: boolean;
}

function LocusBand({ band, isSelected, isDimmed, isDark }: LocusBandProps) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const color = LOCUS_BAND_COLORS[band.locusId] ?? '#a855f7';

  useFrame((state) => {
    if (!materialRef.current) return;

    if (isSelected) {
      const pulse = 0.45 + Math.sin(state.clock.getElapsedTime() * 4) * 0.25;
      materialRef.current.emissiveIntensity = pulse;
    } else {
      materialRef.current.emissiveIntensity = isDimmed ? 0.05 : 0.15;
    }
  });

  return (
    <mesh position={[0, bandArmY(band), 0]}>
      <cylinderGeometry args={[ARM_RADIUS + 0.06, ARM_RADIUS + 0.06, 0.32, 16]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 0.45 : isDimmed ? 0.05 : 0.15}
        metalness={0.15}
        roughness={isDark ? 0.35 : 0.28}
        transparent={isDimmed}
        opacity={isDimmed ? 0.55 : 1}
      />
    </mesh>
  );
}

export function ChromosomeMesh({
  chromosomeNumber,
  position,
  isFocused = false,
  isDark = false,
  selectedLocusId = null,
}: MeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const hoveredChromosome = useGeneticStore((state) => state.hoveredChromosome);
  const setHoveredChromosome = useGeneticStore((state) => state.setHoveredChromosome);

  const palette = isDark ? COLORS.dark : COLORS.light;
  const isHovered = hoveredChromosome === chromosomeNumber;
  const isActive = isFocused || isHovered;
  const locusBands = getLocusBandsForChromosome(chromosomeNumber);
  const hasSelection = Boolean(selectedLocusId);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * (isFocused ? 0.5 : 0.3);
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.getElapsedTime() + chromosomeNumber) * 0.08;
      meshRef.current.scale.setScalar(isFocused ? 1.12 : 1);
    }
  });

  const armMaterialProps = {
    color: isActive ? palette.active : palette.idleArm,
    emissive: isFocused ? palette.emissive : '#000000',
    emissiveIntensity: isFocused ? 0.22 : 0,
    metalness: 0.12,
    roughness: isDark ? 0.42 : 0.36,
  } as const;

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
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? palette.activeCentromere : palette.idleCentromere}
          emissive={isFocused ? palette.emissive : '#000000'}
          emissiveIntensity={isFocused ? 0.35 : 0}
          metalness={0.18}
          roughness={0.32}
        />
      </mesh>

      <mesh position={[0, ARM_CENTER_OFFSET, 0]}>
        <cylinderGeometry args={[ARM_RADIUS, ARM_RADIUS * 0.88, ARM_LENGTH, 20]} />
        <meshStandardMaterial {...armMaterialProps} />
      </mesh>

      <mesh position={[0, -ARM_CENTER_OFFSET, 0]}>
        <cylinderGeometry args={[ARM_RADIUS * 0.88, ARM_RADIUS, ARM_LENGTH, 20]} />
        <meshStandardMaterial {...armMaterialProps} />
      </mesh>

      {locusBands.map((band) => (
        <LocusBand
          key={band.locusId}
          band={band}
          isSelected={selectedLocusId === band.locusId}
          isDimmed={hasSelection && selectedLocusId !== band.locusId}
          isDark={isDark}
        />
      ))}

      <Html
        position={[0, -3.35, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className={`whitespace-nowrap rounded border px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wide shadow-sm ${
            isDark
              ? 'border-slate-600 bg-slate-900/90 text-slate-200'
              : 'border-slate-300 bg-white/95 text-slate-700'
          }`}
        >
          {getChromosomeLabel(chromosomeNumber)}
        </div>
      </Html>
    </group>
  );
}
