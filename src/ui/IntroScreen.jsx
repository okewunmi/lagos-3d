import React, { useState } from 'react';

export default function IntroScreen({ onBegin }) {
  const [leaving, setLeaving] = useState(false);

  function handleBegin() {
    setLeaving(true);
    setTimeout(onBegin, 700);
  }

  return (
    <div className={'intro' + (leaving ? ' intro-leaving' : '')}>
      <div className="intro-inner">
        <div className="intro-kicker">A three-act history, in sixteen chapters</div>
        <h1 className="intro-title">Eko</h1>
        <div className="intro-subtitle">The Lagos Chronicle, before the treaties to today</div>

        <p className="intro-body">
          Before Lagos was a British colony, it was Eko — a Yoruba kingdom
          with its own government, trade, and royal culture, centuries
          older than any ship that ever entered its lagoon. This is that
          story: from the Awori settlers and the House of Olofin, through
          the 1852 treaty and the 1861 Cession, to the traditional
          institutions still standing in Lagos today.
        </p>

        <button className="intro-begin" onClick={handleBegin}>
          Begin the Story ↓
        </button>

        <div className="intro-note">Best viewed with sound and scrolling, on desktop or mobile.</div>
      </div>
    </div>
  );
}
