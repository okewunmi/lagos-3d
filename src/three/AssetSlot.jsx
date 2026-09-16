import React, { Suspense, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import Marker from './Marker.jsx';

// Drop a real Mixamo/Tripo/Meshy export at /public/models/<modelPath>
// and set `model` (+ optionally `animation`) on the marker in chapters.js —
// no other code changes needed. Until then, this renders the flat-color
// placeholder so the scene never breaks.
//
// Real character exports rarely agree on scale or origin (some center
// on the pelvis, some on the whole bounding box, some model in cm not
// meters). Rather than hand-tune every drop-in, figures are auto-fit:
// scaled uniformly so they stand `targetHeight` tall, and repositioned
// so their feet touch y=0 under the marker's given position.

class Boundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function RealModel({ modelPath, animation, pos, type, targetHeight = 1.8 }) {
  const { scene, animations } = useGLTF(`/models/${modelPath}`);
  // Clone per-instance: the same character (e.g. Kosoko) can appear in
  // more than one chapter, and a single Object3D can't live in two
  // places in the scene graph at once.
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const { actions } = useAnimations(animations, cloned);
  const [fit, setFit] = useState(null);

  useEffect(() => {
    if (type !== 'figure') {
      setFit({ scale: 1, offset: [0, 0, 0] });
      return;
    }
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = size.y > 0 ? targetHeight / size.y : 1;
    setFit({ scale: s, offset: [-center.x * s, -box.min.y * s, -center.z * s] });
  }, [cloned, type, targetHeight]);

  useEffect(() => {
    if (!actions) return;
    const clip = animation ? actions[animation] : Object.values(actions)[0];
    clip?.reset().fadeIn(0.4).play();
    return () => clip?.fadeOut(0.4);
  }, [actions, animation]);

  if (!fit) return null;
  return (
    <group position={pos}>
      <primitive object={cloned} position={fit.offset} scale={fit.scale} />
    </group>
  );
}

export default function AssetSlot({ type, pos, color, scale, model, animation, variant }) {
  const placeholder = <Marker type={type} pos={pos} color={color} scale={scale} variant={variant} />;
  if (!model) return placeholder;
  return (
    <Boundary fallback={placeholder}>
      <Suspense fallback={placeholder}>
        <RealModel modelPath={model} animation={animation} pos={pos} type={type} />
      </Suspense>
    </Boundary>
  );
}
