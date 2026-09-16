import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CHAPTERS, TOTAL_ROMAN } from '../data/chapters.js';

export default function Overlay({ activeIndex, captionIndex, onJump, progress }) {
  const chapter = CHAPTERS[activeIndex];
  const captionRef = useRef(null);
  const titleRef = useRef(null);
  const lastChapterRef = useRef(-1);

  useEffect(() => {
    if (!captionRef.current) return;
    gsap.fromTo(
      captionRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeIndex, captionIndex]);

  useEffect(() => {
    if (lastChapterRef.current === activeIndex) return;
    lastChapterRef.current = activeIndex;
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out', yoyo: true, repeat: 1, repeatDelay: 1.1 }
    );
  }, [activeIndex]);

  return (
    <div className="overlay">
      <div className="hud-top">
        <div className="tag">{chapter.roman} / {TOTAL_ROMAN}</div>
        <div className="progressbar">
          <div className="progressbar-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>

      <div className="titlecard" ref={titleRef}>
        <div className="roman-big">{chapter.roman}</div>
        <h2>{chapter.title}</h2>
        <div className="date">{chapter.date}</div>
      </div>

      <div className="caption" ref={captionRef}>
        {chapter.captions[captionIndex] || chapter.captions[0]}
      </div>

      <div className="dots">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            className={'dot' + (i === activeIndex ? ' active' : '')}
            title={`${c.roman} · ${c.title}`}
            onClick={() => onJump(i)}
          />
        ))}
      </div>

      <div className="scrollhint">scroll to move through the story ↓</div>
    </div>
  );
}
