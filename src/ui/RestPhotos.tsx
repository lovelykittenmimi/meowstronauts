import photoData from '../data/mars-photos/metadata.json';
import pia24173 from '../data/mars-photos/PIA24173.jpg';
import pia25077 from '../data/mars-photos/PIA25077.jpg';
import pia26632 from '../data/mars-photos/PIA26632.jpg';
import type { Lang, Localized } from '../game/types';
import { t, type StringKey } from '../i18n';

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
    captionKey: 'rest.photo.selfie',
    alt: {
      en: 'Curiosity rover selfie at the Mary Anning location on Mars',
      'zh-TW': '好奇號在火星 Mary Anning 地點的自拍',
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

/** The T1 "rest" beat: the crew shows off its "own" photo album. */
export function RestPhotos({ lang }: { lang: Lang }) {
  return (
    <section className="rest-photos" data-testid="rest-photos">
      <header className="rest-photos-head">
        <h3 className="rest-photos-title">{t(lang, 'rest.photos.title')}</h3>
        <span className="rest-photos-claim">{t(lang, 'rest.photos.claim')}</span>
      </header>

      <div className="rest-photos-grid">
        {REST_PHOTOS.map((photo) => {
          const meta = PHOTO_BY_ID.get(photo.nasaId);
          if (!meta) return null;
          return (
            <figure className="rest-photo" key={photo.nasaId}>
              <img src={photo.src} alt={photo.alt[lang]} />
              <figcaption>
                <span>{t(lang, photo.captionKey)}</span>
                <small>
                  {meta.credit} · {meta.nasaId}
                </small>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <p className="rest-photos-fine" data-testid="rest-photos-credit">
        {t(lang, 'rest.photos.credit')}
      </p>
    </section>
  );
}
