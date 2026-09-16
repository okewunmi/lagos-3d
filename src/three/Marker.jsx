import React from 'react';

// Simple flat-color primitive stand-ins. Phase 2 swaps each of these
// for a real Mixamo character (type: 'figure') or poly.pizza prop
// (type: 'ship' / 'palace' / 'hut' / 'flag'), same position/scale.

function Figure({ color }) {
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#caa07a" />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.42, 1.5, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Ship({ color }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.6, 1.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3.2, 6]} />
        <meshStandardMaterial color="#5a4632" />
      </mesh>
      <mesh position={[0.6, 2, 0]} rotation={[0, 0, -0.15]} castShadow>
        <planeGeometry args={[1.6, 2]} />
        <meshStandardMaterial color="#e6ddc4" side={2} />
      </mesh>
    </group>
  );
}

function Palace({ color, scale = 1 }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.8, 2.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.4, 1.2, 4]} />
        <meshStandardMaterial color="#3a2c1c" />
      </mesh>
    </group>
  );
}

function Hut({ color }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 1, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[1.1, 1, 12]} />
        <meshStandardMaterial color="#6b5636" />
      </mesh>
    </group>
  );
}

function Flag({ color, scale = 1, variant }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 3, 6]} />
        <meshStandardMaterial color="#5a4632" />
      </mesh>
      {variant === 'nigeria' ? (
        <group position={[0.5, 2.6, 0]}>
          <mesh position={[-0.33, 0, 0]}>
            <planeGeometry args={[0.34, 0.6]} />
            <meshStandardMaterial color="#008751" side={2} />
          </mesh>
          <mesh>
            <planeGeometry args={[0.34, 0.6]} />
            <meshStandardMaterial color="#ffffff" side={2} />
          </mesh>
          <mesh position={[0.33, 0, 0]}>
            <planeGeometry args={[0.34, 0.6]} />
            <meshStandardMaterial color="#008751" side={2} />
          </mesh>
        </group>
      ) : (
        <mesh position={[0.5, 2.6, 0]}>
          <planeGeometry args={[1, 0.6]} />
          <meshStandardMaterial color={color} side={2} />
        </mesh>
      )}
    </group>
  );
}

const BY_TYPE = { figure: Figure, ship: Ship, palace: Palace, hut: Hut, flag: Flag };

export default function Marker({ type, pos, color = '#B08A45', scale = 1, variant }) {
  const Cmp = BY_TYPE[type] || Figure;
  return (
    <group position={pos}>
      <Cmp color={color} scale={scale} variant={variant} />
    </group>
  );
}
