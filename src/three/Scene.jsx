// import React, { useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { CHAPTERS } from '../data/chapters.js';
// import AssetSlot from './AssetSlot.jsx';
// import CameraRig from './CameraRig.jsx';

// function GuidePath() {
//   const points = useMemo(() => {
//     const curve = new THREE.CatmullRomCurve3(
//       CHAPTERS.map((c) => new THREE.Vector3(...c.center)),
//       false,
//       'catmullrom',
//       0.4
//     );
//     return curve.getPoints(300);
//   }, []);
//   const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
//   return (
//     <line geometry={geom}>
//       <lineBasicMaterial color="#B08A45" transparent opacity={0.35} />
//     </line>
//   );
// }

// function Ground() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -50]} receiveShadow>
//       <planeGeometry args={[80, 260]} />
//       <meshStandardMaterial color="#1c2a26" roughness={1} />
//     </mesh>
//   );
// }

// function CannonFlashes() {
//   const battle = CHAPTERS.find((c) => c.title.includes('Reduction'));
//   const lightRefs = useRef([]);
//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime();
//     lightRefs.current.forEach((light, i) => {
//       if (!light) return;
//       const flicker = Math.max(0, Math.sin(t * 9 + i * 3.7)) * Math.max(0, Math.sin(t * 2.1 + i));
//       light.intensity = flicker * 6;
//     });
//   });
//   if (!battle) return null;
//   return (
//     <>
//       {battle.markers
//         .filter((m) => m.type === 'ship')
//         .map((m, i) => (
//           <pointLight
//             key={i}
//             ref={(el) => (lightRefs.current[i] = el)}
//             position={[m.pos[0], 1.4, m.pos[2]]}
//             color="#f3c15f"
//             distance={9}
//             intensity={0}
//           />
//         ))}
//     </>
//   );
// }

// export default function Scene({ progressRef }) {
//   return (
//     <>
//       <hemisphereLight args={['#cfe0e8', '#0a0e13', 0.55]} />
//       <directionalLight
//         name="keyLight"
//         position={[6, 10, 4]}
//         intensity={1}
//         color="#cfe0e8"
//         castShadow
//       />
//       <Ground />
//       <GuidePath />
//       <CannonFlashes />
//       {CHAPTERS.map((chapter) =>
//         chapter.markers.map((m, i) => (
//           <AssetSlot
//             key={`${chapter.id}-${i}`}
//             type={m.type}
//             pos={m.pos}
//             color={m.color}
//             scale={m.scale}
//             model={m.model}
//             animation={m.animation}
//             variant={m.variant}
//           />
//         ))
//       )}
//       <CameraRig progressRef={progressRef} />
//     </>
//   );
// }



import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHAPTERS } from '../data/chapters.js';
import AssetSlot from './AssetSlot.jsx';
import CameraRig from './CameraRig.jsx';
import Environment from './Environment.jsx';

function GuidePath() {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      CHAPTERS.map((c) => new THREE.Vector3(...c.center)),
      false,
      'catmullrom',
      0.4
    );
    return curve.getPoints(300);
  }, []);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line geometry={geom}>
      <lineBasicMaterial color="#B08A45" transparent opacity={0.35} />
    </line>
  );
}

function CannonFlashes() {
  const battle = CHAPTERS.find((c) => c.title.includes('Reduction'));
  const lightRefs = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    lightRefs.current.forEach((light, i) => {
      if (!light) return;
      const flicker = Math.max(0, Math.sin(t * 9 + i * 3.7)) * Math.max(0, Math.sin(t * 2.1 + i));
      light.intensity = flicker * 6;
    });
  });
  if (!battle) return null;
  return (
    <>
      {battle.markers
        .filter((m) => m.type === 'ship')
        .map((m, i) => (
          <pointLight
            key={i}
            ref={(el) => (lightRefs.current[i] = el)}
            position={[m.pos[0], 1.4, m.pos[2]]}
            color="#f3c15f"
            distance={9}
            intensity={0}
          />
        ))}
    </>
  );
}

export default function Scene({ progressRef }) {
  return (
    <>
      <hemisphereLight args={['#cfe0e8', '#0a0e13', 0.55]} />
      <directionalLight
        name="keyLight"
        position={[6, 10, 4]}
        intensity={1}
        color="#cfe0e8"
        castShadow
      />
      <Environment />
      <GuidePath />
      <CannonFlashes />
      {CHAPTERS.map((chapter) =>
        chapter.markers.map((m, i) => (
          <AssetSlot
            key={`${chapter.id}-${i}`}
            type={m.type}
            pos={m.pos}
            color={m.color}
            scale={m.scale}
            model={m.model}
            animation={m.animation}
            variant={m.variant}
          />
        ))
      )}
      <CameraRig progressRef={progressRef} />
    </>
  );
}
