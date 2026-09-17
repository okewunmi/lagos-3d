// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Lenis from 'lenis';
// import Scene from './three/Scene.jsx';
// import Overlay from './ui/Overlay.jsx';
// import { CHAPTERS, TOTAL_LENGTH_VH } from './data/chapters.js';

// export default function App() {
//   const progressRef = useRef(0);
//   const [progress, setProgress] = useState(0);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [captionIndex, setCaptionIndex] = useState(0);
//   const lenisRef = useRef(null);
//   const lastActiveRef = useRef(0);
//   const lastCaptionRef = useRef(0);

//   useEffect(() => {
//     const lenis = new Lenis({
//       duration: 1.15,
//       smoothWheel: true,
//       smoothTouch: false,
//     });
//     lenisRef.current = lenis;

//     function raf(time) {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     }
//     requestAnimationFrame(raf);

//     lenis.on('scroll', ({ scroll, limit }) => {
//       const p = limit > 0 ? Math.min(Math.max(scroll / limit, 0), 1) : 0;
//       progressRef.current = p;
//       setProgress(p);

//       const n = CHAPTERS.length;
//       const raw = p * n;
//       const idx = Math.min(Math.floor(raw), n - 1);
//       const localT = raw - idx;
//       const captions = CHAPTERS[idx].captions;
//       const capIdx = Math.min(Math.floor(localT * captions.length), captions.length - 1);

//       if (idx !== lastActiveRef.current) {
//         lastActiveRef.current = idx;
//         setActiveIndex(idx);
//       }
//       if (capIdx !== lastCaptionRef.current) {
//         lastCaptionRef.current = capIdx;
//         setCaptionIndex(capIdx);
//       }
//     });

//     return () => {
//       lenis.destroy();
//     };
//   }, []);

//   const handleJump = useCallback((chapterIdx) => {
//     const doc = document.documentElement;
//     const maxScroll = doc.scrollHeight - window.innerHeight;
//     const targetP = chapterIdx / CHAPTERS.length + 0.02;
//     const targetY = targetP * maxScroll;
//     lenisRef.current?.scrollTo(targetY, { duration: 1.2 });
//   }, []);

//   return (
//     <div className="page">
//       <div className="stage">
//         <Canvas
//           shadows
//           camera={{ fov: 52, near: 0.1, far: 200, position: [0, 3, 4] }}
//           gl={{ antialias: true }}
//         >
//           <color attach="background" args={['#0a0e13']} />
//           <Scene progressRef={progressRef} />
//         </Canvas>
//         <Overlay
//           activeIndex={activeIndex}
//           captionIndex={captionIndex}
//           progress={progress}
//           onJump={handleJump}
//         />
//       </div>
//       <div style={{ height: `${TOTAL_LENGTH_VH}vh` }} aria-hidden="true" />
//     </div>
//   );
// }


import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import Scene from './three/Scene.jsx';
import Overlay from './ui/Overlay.jsx';
import IntroScreen from './ui/IntroScreen.jsx';
import BackgroundAudio from './audio/BackgroundAudio.jsx';
import { CHAPTERS, TOTAL_LENGTH_VH } from './data/chapters.js';

export default function App() {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const lenisRef = useRef(null);
  const lastActiveRef = useRef(0);
  const lastCaptionRef = useRef(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ({ scroll, limit }) => {
      const p = limit > 0 ? Math.min(Math.max(scroll / limit, 0), 1) : 0;
      progressRef.current = p;
      setProgress(p);

      const n = CHAPTERS.length;
      const raw = p * n;
      const idx = Math.min(Math.floor(raw), n - 1);
      const localT = raw - idx;
      const captions = CHAPTERS[idx].captions;
      const capIdx = Math.min(Math.floor(localT * captions.length), captions.length - 1);

      if (idx !== lastActiveRef.current) {
        lastActiveRef.current = idx;
        setActiveIndex(idx);
      }
      if (capIdx !== lastCaptionRef.current) {
        lastCaptionRef.current = capIdx;
        setCaptionIndex(capIdx);
      }
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleJump = useCallback((chapterIdx) => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const targetP = chapterIdx / CHAPTERS.length + 0.02;
    const targetY = targetP * maxScroll;
    lenisRef.current?.scrollTo(targetY, { duration: 1.2 });
  }, []);

  const handleBegin = useCallback(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    setIntroDone(true);
  }, []);

  return (
    <div className="page">
      <div className="stage">
        <Canvas
          shadows
          camera={{ fov: 52, near: 0.1, far: 200, position: [0, 3, 4] }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#0a0e13']} />
          <Scene progressRef={progressRef} />
        </Canvas>
        <Overlay
          activeIndex={activeIndex}
          captionIndex={captionIndex}
          progress={progress}
          onJump={handleJump}
        />
        <BackgroundAudio start={introDone} />
        {!introDone && <IntroScreen onBegin={handleBegin} />}
      </div>
      <div style={{ height: `${TOTAL_LENGTH_VH}vh` }} aria-hidden="true" />
    </div>
  );
}
