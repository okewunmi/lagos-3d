import React, { useEffect, useRef, useState } from 'react';

// Silent-fallback audio, same philosophy as AssetSlot: if
// /public/audio/background.mp3 doesn't exist, the toggle button
// simply never appears — nothing breaks, nothing is shown broken.
// Drop a legally-sourced ambient/instrumental track at that path
// and the control appears automatically.
export default function BackgroundAudio({ start }) {
  const ref = useRef(null);
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (start && ref.current && available) {
      ref.current.volume = 0.32;
      ref.current.play().catch(() => {});
    }
  }, [start, available]);

  function toggle() {
    if (!ref.current) return;
    if (ref.current.paused) ref.current.play().catch(() => {});
    else ref.current.pause();
  }

  if (!available) return null;

  return (
    <>
      <audio
        ref={ref}
        src="/audio/background.mp3"
        loop
        preload="metadata"
        onError={() => setAvailable(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button className="audio-toggle" onClick={toggle} title="Toggle background music" aria-label="Toggle background music">
        {playing ? '\u266A' : '\u266A\u0338'}
      </button>
    </>
  );
}
