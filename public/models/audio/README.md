# Background audio

Drop one file here named exactly `background.mp3` and the mute/unmute
button appears in the UI automatically — no code changes needed. If
this file doesn't exist, the button silently doesn't render (same
fallback philosophy as the character models).

## On sourcing something like "a eulogy for Lagos"

I can't fetch or embed a real, copyrighted piece of music myself —
that's a hard copyright line I don't cross, regardless of how the
request is framed. What I *can* do is build the playback system
(done) and point you toward where to legally get something that fits
the mood:

- **Royalty-free instrumental/ambient libraries**: YouTube Audio
  Library (free, no account needed beyond a Google login), Pixabay
  Music, Free Music Archive — search terms like "African ambient",
  "kora", "talking drum", "elegy", "meditative strings".
- **Nigerian/Yoruba traditional instrumentation specifically**: search
  those libraries for "talking drum", "kora", "balafon", or "Yoruba
  traditional" — closer to the project's actual setting than generic
  orchestral ambient.
- **Commission or license one directly** if this is genuinely headed
  for a government/schools showcase — a short (2–3 minute, loopable)
  original instrumental piece from a Nigerian composer would fit the
  project's authenticity goals better than any stock library track,
  and avoids any licensing ambiguity entirely for an official use case.

## Technical notes

- Keep it **loopable** — the player loops seamlessly, so a clean
  start/end (no hard fade-in cold open) sounds best.
- **MP3, under ~5MB** is a reasonable target so it doesn't compete
  with the character models for load time.
- Volume is set to 0.32 in `BackgroundAudio.jsx` — quiet enough to sit
  under narration/captions without a separate mixing step.
