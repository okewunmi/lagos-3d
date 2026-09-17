import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CHAPTERS } from '../data/chapters.js';

// Ground color per environment type — the base terrain under and
// around each chapter's action.
const GROUND_COLOR = {
  water: '#16241f',      // dark lagoon bed, mostly hidden under the water plane
  forest: '#233b28',     // rich green undergrowth
  road: '#5a4530',       // packed clay/dirt path
  courtyard: '#5c4a34',  // swept packed-earth palace ground
};

// Deterministic pseudo-random so scattered props don't jump around
// on every re-render.
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function computeSegments() {
  const sorted = [...CHAPTERS].sort((a, b) => b.center[2] - a.center[2]);
  return sorted.map((chapter, i) => {
    const prev = sorted[i - 1];
    const next = sorted[i + 1];
    const zHigh = prev ? (prev.center[2] + chapter.center[2]) / 2 : chapter.center[2] + 8;
    const zLow = next ? (chapter.center[2] + next.center[2]) / 2 : chapter.center[2] - 8;
    return { chapter, zHigh, zLow, zMid: (zHigh + zLow) / 2, length: zHigh - zLow };
  });
}

function Tree({ x, z, scale = 1 }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.8, 6]} />
        <meshStandardMaterial color="#4a3624" />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[0.9, 1.6, 8]} />
        <meshStandardMaterial color="#2f5c3a" />
      </mesh>
      <mesh position={[0, 2.9, 0]} castShadow>
        <coneGeometry args={[0.65, 1.2, 8]} />
        <meshStandardMaterial color="#3a6d46" />
      </mesh>
    </group>
  );
}

function Reed({ x, z, scale = 1 }) {
  return (
    <mesh position={[x, 0.6 * scale, z]} scale={scale} castShadow>
      <coneGeometry args={[0.05, 1.2, 4]} />
      <meshStandardMaterial color="#4a6b4a" />
    </mesh>
  );
}

function Rock({ x, z, scale = 1 }) {
  return (
    <mesh position={[x, 0.15 * scale, z]} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#6b5a4a" roughness={1} />
    </mesh>
  );
}

function WaterPlane({ zMid, length }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, zMid]}>
      <planeGeometry args={[70, length + 2]} />
      <meshStandardMaterial color="#2E5C55" transparent opacity={0.82} roughness={0.25} metalness={0.15} />
    </mesh>
  );
}

function RoadStrip({ zMid, length }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, zMid]}>
      <planeGeometry args={[6, length + 2]} />
      <meshStandardMaterial color="#7a5a3a" roughness={1} />
    </mesh>
  );
}

function Scatter({ segment }) {
  const rand = useMemo(() => seededRandom(segment.chapter.id * 97 + 13), [segment.chapter.id]);
  const items = useMemo(() => {
    const out = [];
    const count = segment.chapter.environment === 'courtyard' ? 0 : 5;
    for (let i = 0; i < count; i++) {
      const z = segment.zLow + rand() * segment.length;
      const side = rand() < 0.5 ? -1 : 1;
      const x = side * (9 + rand() * 8);
      const scale = 0.7 + rand() * 0.6;
      out.push({ x, z, scale });
    }
    return out;
  }, [segment, rand]);

  if (segment.chapter.environment === 'forest') {
    return items.map((it, i) => <Tree key={i} {...it} />);
  }
  if (segment.chapter.environment === 'water') {
    return items.map((it, i) => <Reed key={i} x={it.x * 0.55} z={it.z} scale={it.scale} />);
  }
  if (segment.chapter.environment === 'road') {
    return items.map((it, i) => <Rock key={i} {...it} />);
  }
  return null;
}

export default function Environment() {
  const segments = useMemo(() => computeSegments(), []);

  return (
    <>
      {segments.map((seg) => (
        <group key={seg.chapter.id}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.05, seg.zMid]}
            receiveShadow
          >
            <planeGeometry args={[80, seg.length + 0.5]} />
            <meshStandardMaterial color={GROUND_COLOR[seg.chapter.environment] || '#233b28'} roughness={1} />
          </mesh>

          {seg.chapter.environment === 'water' && <WaterPlane zMid={seg.zMid} length={seg.length} />}
          {seg.chapter.environment === 'road' && <RoadStrip zMid={seg.zMid} length={seg.length} />}

          <Scatter segment={seg} />
        </group>
      ))}
    </>
  );
}
