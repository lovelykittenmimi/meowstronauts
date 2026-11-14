import { useEffect } from 'react';
import marsLandscape from '../data/mars-photos/PIA26632.jpg';

interface OpeningSceneProps {
  lang: 'en' | 'zh-TW';
  onDone: () => void;
}

/** ?scene=opening2 — silent 18-second opening shot for the demo video. */
export function OpeningScene({ lang, onDone }: OpeningSceneProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 18000);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <main className="opening-scene" aria-label="Opening scene">
      <div className="opening-stars" aria-hidden="true" />
      <div className="opening-sun" aria-hidden="true" />
      <div className="opening-flare" aria-hidden="true" />
      <img className="opening-mars" src={marsLandscape} alt="" />
      <div className="opening-ship" aria-hidden="true">
        <span />
      </div>
      <div className="opening-caption">
        <p>Sol 0 · Hope-1</p>
        <h1>
          {lang === 'en'
            ? 'A strong solar flare. A rough landing.'
            : '強烈的太陽閃焰。一次粗暴的降落。'}
        </h1>
        <p className="snapshot-note">NASA imagery · historical snapshot</p>
      </div>
      <button type="button" className="ghost-button opening-skip" onClick={onDone}>
        {lang === 'en' ? 'Skip' : '跳過'}
      </button>
    </main>
  );
}
