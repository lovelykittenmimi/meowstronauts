import { useState } from 'react';
import { createPortal } from 'react-dom';
import photoData from '../data/mars-photos/metadata.json';
import pia24173 from '../data/mars-photos/PIA24173.jpg';
import pia25077 from '../data/mars-photos/PIA25077.jpg';
import pia26632 from '../data/mars-photos/PIA26632.jpg';
import type { CatId, Lang, Localized } from '../game/types';
import { CAT_NAMES, t, type StringKey } from '../i18n';
import { moodFace, type FaceMood } from './catFaces';
import { Modal } from './Modal';

interface RestPhoto {
  nasaId: string;
  src: string;
  captionKey: StringKey;
  alt: Localized;
}

const REST_PHOTOS: RestPhoto[] = [
  {
    nasaId: 'PIA26632',
    src: pia26632,
    captionKey: 'rest.photo.landscape',
    alt: {
      en: "Mars landscape photographed by NASA's Curiosity rover",
      'zh-TW': 'NASA 好奇號探測車拍攝的火星地貌',
    },
  },
  {
    nasaId: 'PIA24173',
    src: pia24173,
    captionKey: 'rest.photo.photographer',
    alt: {
      en: 'Curiosity rover at the Mary Anning location on Mars',
      'zh-TW': '好奇號在火星 Mary Anning 地點',
    },
  },
  {
    nasaId: 'PIA25077',
    src: pia25077,
    captionKey: 'rest.photo.rock',
    alt: {
      en: 'Close-up of a flower-shaped rock photographed by Curiosity',
      'zh-TW': '好奇號拍攝的花狀岩石特寫',
    },
  },
];

const PHOTO_BY_ID = new Map(photoData.photos.map((photo) => [photo.nasaId, photo]));

interface RestIntroLine {
  cat: CatId;
  mood: FaceMood;
  text: Localized;
}

const REST_INTRO: RestIntroLine[] = [
  {
    cat: 'silver',
    mood: 'determined',
    text: {
      en: 'Listen up. Photo time. Ginger wants to stay for snacks, but Shadow votes with me — two to one.',
      'zh-TW': '全體注意，拍照時間。金桔想留下來吃零食，但暗影投我——二比一。',
    },
  },
  {
    cat: 'ginger',
    mood: 'happy',
    text: {
      en: 'Fine. But the snacks are coming with me.',
      'zh-TW': '好啦。不過零食要跟我一起去。',
    },
  },
];

/** The T1 "rest" beat: the crew shows off its "own" photo album. */
export function RestPhotos({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(true);
  const [intro, setIntro] = useState(true);
  const [index, setIndex] = useState(0);

  if (!open) {
    return (
      <button
        type="button"
        className="ghost-button rest-photos-open"
        data-testid="rest-photos-open"
        onClick={() => {
          setIntro(false);
          setIndex(0);
          setOpen(true);
        }}
      >
        {t(lang, 'rest.photos.open')}
      </button>
    );
  }

  const photo = REST_PHOTOS[index];
  const meta = PHOTO_BY_ID.get(photo.nasaId);
  if (!meta) return null;
  const isLast = index === REST_PHOTOS.length - 1;

  const advance = () => {
    if (intro) {
      setIntro(false);
      setIndex(0);
      return;
    }
    if (isLast) setOpen(false);
    else setIndex((value) => value + 1);
  };

  return createPortal(
    <Modal
      title={t(lang, 'rest.photos.title')}
      onClose={() => setOpen(false)}
      testId="rest-photos"
      bare
    >
      <div className="rest-photos-card">
        <button
          type="button"
          className="icon-button rest-photos-x"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          ×
        </button>

        {intro ? (
          <div className="rest-photos-intro">
            {REST_INTRO.map((line, lineIndex) => (
              <p className={`rest-photos-intro-line is-${line.cat}`} key={lineIndex}>
                <img
                  className="rest-photos-intro-avatar"
                  src={moodFace(line.cat, line.mood)}
                  alt=""
                  aria-hidden="true"
                />
                <span className="rest-photos-intro-copy">
                  <strong>{CAT_NAMES[line.cat][lang]}</strong> {line.text[lang]}
                </span>
              </p>
            ))}
          </div>
        ) : (
          <div className="rest-photo-wrap">
            <img
              className="rest-photo-frame"
              key={photo.nasaId}
              src={photo.src}
              alt={photo.alt[lang]}
              title={`${photo.alt[lang]} · ${meta.credit} · ${meta.nasaId}`}
            />
          </div>
        )}

        <div className={`rest-photos-strip${intro ? ' is-intro' : ''}`}>
          {!intro && <p className="rest-photos-caption">{t(lang, photo.captionKey)}</p>}
          <button
            type="button"
            className="primary-button rest-photos-next"
            data-testid="rest-photo-next"
            onClick={advance}
          >
            {intro || !isLast
              ? t(lang, 'rest.photos.next')
              : t(lang, 'rest.photos.close')}
          </button>
          {!intro && (
            <p className="rest-photos-fine" data-testid="rest-photos-credit">
              {t(lang, 'rest.photos.credit')}
            </p>
          )}
        </div>
      </div>
    </Modal>,
    document.body,
  );
}
