// import React, { useMemo, useRef } from 'react';
// import { useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { CHAPTERS } from '../data/chapters.js';

// function lerpColor(a, b, t) {
//   const ca = new THREE.Color(a);
//   const cb = new THREE.Color(b);
//   return ca.lerp(cb, t);
// }

// export default function CameraRig({ progressRef }) {
//   const { camera, scene } = useThree();
//   const lookTarget = useRef(new THREE.Vector3());
//   const fogRef = useRef(new THREE.Color(CHAPTERS[0].fog));
//   const mouse = useRef({ x: 0, y: 0 });
//   const shakeSeed = useRef(0);

//   React.useEffect(() => {
//     function onMove(e) {
//       mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
//       mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
//     }
//     window.addEventListener('pointermove', onMove);
//     return () => window.removeEventListener('pointermove', onMove);
//   }, []);

//   const curve = useMemo(() => {
//     const pts = CHAPTERS.map((c) => new THREE.Vector3(...c.center));
//     return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
//   }, []);

//   useMemo(() => {
//     scene.fog = new THREE.Fog(fogRef.current, 8, 55);
//   }, [scene]);

//   const battleIndex = CHAPTERS.findIndex((c) => c.title.includes('Reduction'));

//   useFrame((_, delta) => {
//     const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
//     const ahead = THREE.MathUtils.clamp(t + 0.025, 0, 1);

//     const pos = curve.getPointAt(t);
//     const lookPos = curve.getPointAt(ahead);

//     // Battle chapter: hand-held camera shake, intensity peaks mid-chapter
//     const n = CHAPTERS.length - 1;
//     const chapterFloat = t * n;
//     const distFromBattle = Math.abs(chapterFloat - battleIndex);
//     const shakeAmt = Math.max(0, 1 - distFromBattle * 1.6) * 0.12;
//     shakeSeed.current += delta * 18;
//     const shakeX = Math.sin(shakeSeed.current * 1.7) * shakeAmt;
//     const shakeY = Math.cos(shakeSeed.current * 2.3) * shakeAmt * 0.6;

//     // Gentle mouse-look parallax
//     const parX = mouse.current.x * 0.35;
//     const parY = mouse.current.y * 0.18;

//     camera.position.set(pos.x + shakeX, pos.y + 1.1 + shakeY, pos.z);
//     lookTarget.current.lerp(lookPos, 0.15);
//     camera.lookAt(
//       lookTarget.current.x + parX,
//       lookTarget.current.y + 0.6 + parY,
//       lookTarget.current.z
//     );

//     // Mood cross-fade: find bounding chapters for this t and lerp fog/light
//     const raw = t * n;
//     const i = Math.min(Math.floor(raw), n - 1);
//     const localT = raw - i;
//     const a = CHAPTERS[i];
//     const b = CHAPTERS[Math.min(i + 1, n)];

//     const targetFog = lerpColor(a.fog, b.fog, localT);
//     fogRef.current.lerp(targetFog, 0.08);
//     if (scene.fog) scene.fog.color.copy(fogRef.current);

//     const light = scene.getObjectByName('keyLight');
//     if (light) {
//       const targetColor = lerpColor(a.light, b.light, localT);
//       light.color.lerp(targetColor, 0.08);
//       light.intensity = THREE.MathUtils.lerp(light.intensity, THREE.MathUtils.lerp(a.intensity, b.intensity, localT), 0.08);
//     }
//   });

//   return null;
// }

// export function getCurvePoints() {
//   return CHAPTERS.map((c) => new THREE.Vector3(...c.center));
// }








import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CHAPTERS } from '../data/chapters.js';

function lerpColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t);
}

export default function CameraRig({ progressRef }) {
  const { camera, scene } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const fogRef = useRef(new THREE.Color(CHAPTERS[0].fog));
  const mouse = useRef({ x: 0, y: 0 });
  const shakeSeed = useRef(0);

  React.useEffect(() => {
    function onMove(e) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const curve = useMemo(() => {
    const pts = CHAPTERS.map((c) => new THREE.Vector3(...c.center));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  }, []);

  useMemo(() => {
    scene.fog = new THREE.Fog(fogRef.current, 8, 55);
  }, [scene]);

  const battleIndex = CHAPTERS.findIndex((c) => c.title.includes('Reduction'));

  useFrame((_, delta) => {
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const ahead = THREE.MathUtils.clamp(t + 0.025, 0, 1);

    const pos = curve.getPointAt(t);
    const lookPos = curve.getPointAt(ahead);

    // Battle chapter: hand-held camera shake, intensity peaks mid-chapter
    const n = CHAPTERS.length - 1;
    const chapterFloat = t * n;
    const distFromBattle = Math.abs(chapterFloat - battleIndex);
    const shakeAmt = Math.max(0, 1 - distFromBattle * 1.6) * 0.12;
    shakeSeed.current += delta * 18;
    const shakeX = Math.sin(shakeSeed.current * 1.7) * shakeAmt;
    const shakeY = Math.cos(shakeSeed.current * 2.3) * shakeAmt * 0.6;

    // Gentle mouse-look parallax
    const parX = mouse.current.x * 0.35;
    const parY = mouse.current.y * 0.18;

    camera.position.set(pos.x + shakeX, pos.y + 1.1 + shakeY, pos.z);
    lookTarget.current.lerp(lookPos, 0.15);
    camera.lookAt(
      lookTarget.current.x + parX,
      lookTarget.current.y + 0.6 + parY,
      lookTarget.current.z
    );

    // Mood cross-fade: find bounding chapters for this t and lerp fog/light
    const raw = t * n;
    const i = Math.min(Math.floor(raw), n - 1);
    const localT = raw - i;
    const a = CHAPTERS[i];
    const b = CHAPTERS[Math.min(i + 1, n)];

    const targetFog = lerpColor(a.fog, b.fog, localT);
    fogRef.current.lerp(targetFog, 0.08);
    if (scene.fog) scene.fog.color.copy(fogRef.current);
    if (scene.background && scene.background.isColor) scene.background.copy(fogRef.current);

    const light = scene.getObjectByName('keyLight');
    if (light) {
      const targetColor = lerpColor(a.light, b.light, localT);
      light.color.lerp(targetColor, 0.08);
      light.intensity = THREE.MathUtils.lerp(light.intensity, THREE.MathUtils.lerp(a.intensity, b.intensity, localT), 0.08);
    }
  });

  return null;
}

export function getCurvePoints() {
  return CHAPTERS.map((c) => new THREE.Vector3(...c.center));
}
