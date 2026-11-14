import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import crashScene from '../assets/generated/scenes/06-crash.webp';
import lineupScene from '../assets/generated/scenes/05-team-lineup.webp';
import galeClose from '../assets/nasa/gale-close.webp';
import galeMid from '../assets/nasa/gale-mid.webp';
import galeWide from '../assets/nasa/gale-wide.webp';
import marsGlobe from '../assets/nasa/mars-globe.webp';
import sdoFlare from '../assets/nasa/sdo-flare.webp';
import sohoCme from '../assets/nasa/soho-cme.webp';
import scene2Video from '../assets/video/scene2-crash.mp4';
import marsLandscape from '../data/mars-photos/PIA26632.jpg';
import { getKnowledgeCard } from '../game/knowledge';
import type { Lang, Localized } from '../game/types';
import LanderOverlay from '../minigames/LanderOverlay';
import { Modal } from './Modal';
import { RichText } from './RichText';

const l = (en: string, zh: string): Localized => ({ en, 'zh-TW': zh });

type Speaker = 'silver' | 'shadow' | 'ginger' | 'narrator';

interface Line {
  cat: Speaker;
  text: Localized;
}

const SPEAKER_NAMES: Record<Exclude<Speaker, 'narrator'>, string> = {
  silver: 'Silver',
  shadow: 'Shadow',
  ginger: 'Ginger',
};

const SCENE_TITLES: Localized[] = [
  l('A quiet morning', '安靜的早晨'),
  l('The crash', '迫降'),
  l('Three cats', '三隻貓'),
  l('Seven days', '七天'),
  l('Three systems', '三個系統'),
  l('Ready?', '準備好了嗎？'),
];

const SCENE_ONE: Line = {
  cat: 'narrator',
  text: l(
    'This is Mars, 220 million kilometers from Earth. Here stands a human outpost: Hope-1. Today, only one junior commander is home.',
    '這裡是火星，距離地球 2 億 2 千萬公里。這裡有一座人類基地：希望一號。今天，基地裡只有一位見習指揮官。',
  ),
};

const CRASH_LINES: Line[] = [
  { cat: 'shadow', text: l('Stardust calling Mars Base! We were hit by the {{solarStorm}}! The tail is on fire and the dashboard keeps—', '星塵號呼叫火星基地！我們被{{solarStorm}}打中了！船尾著火，儀表板一直嗶嗶叫，還有——') },
  { cat: 'ginger', text: l('My tail is on fire too!', '我的尾巴也著火了！') },
  { cat: 'shadow', text: l('That is the tail.', '那是船尾。') },
  { cat: 'ginger', text: l('Oh.', '哦。') },
  { cat: 'narrator', text: l('Then they hit us.', '然後，他們就撞上來了。') },
  { cat: 'narrator', text: l('The storm knocked out the antenna. Radio delay to Earth is about twelve minutes.', '風暴撞壞了天線。與地球的無線電通訊單向延遲約十二分鐘。') },
];

interface NasaShot {
  key: string;
  src: string;
  credit: string;
  duration: number;
  fit: 'cover' | 'contain';
  alt: Localized;
}

// Real NASA imagery before the crash clip. Durations produce the 5-second
// solar-storm -> Mars -> Gale approach; when it ends the crash clip starts
// from 0 s, so no frame of the clip is ever covered.
const NASA_SHOTS: NasaShot[] = [
  {
    key: 'flare',
    src: sdoFlare,
    credit: 'NASA / SDO',
    duration: 1000,
    fit: 'contain',
    alt: l('NASA SDO image of a solar flare', 'NASA SDO 拍攝的太陽閃焰'),
  },
  {
    key: 'cme',
    src: sohoCme,
    credit: 'NASA / ESA / SOHO',
    duration: 800,
    fit: 'cover',
    alt: l(
      'NASA and ESA SOHO image of a coronal mass ejection',
      'NASA 與 ESA SOHO 拍攝的日冕物質拋射',
    ),
  },
  {
    key: 'mars',
    src: marsGlobe,
    credit: 'NASA / USGS / Viking',
    duration: 1000,
    fit: 'contain',
    alt: l(
      'Viking image of Mars showing Valles Marineris',
      'Viking 拍攝的火星，可見水手號峽谷',
    ),
  },
  {
    key: 'gale-wide',
    src: galeWide,
    credit: 'NASA/JPL-Caltech · Mars Trek',
    duration: 800,
    fit: 'cover',
    alt: l('Mars Trek overhead view of Gale Crater', 'Mars Trek 的蓋爾撞擊坑俯瞰圖'),
  },
  {
    key: 'gale-mid',
    src: galeMid,
    credit: 'NASA/JPL-Caltech · Mars Trek',
    duration: 800,
    fit: 'cover',
    alt: l('Mars Trek close view of Gale Crater', 'Mars Trek 的蓋爾撞擊坑近照'),
  },
  {
    key: 'gale-close',
    src: galeClose,
    credit: 'NASA/JPL-Caltech · Mars Trek',
    duration: 600,
    fit: 'cover',
    alt: l('Mars Trek detail of Gale Crater', 'Mars Trek 的蓋爾撞擊坑細部影像'),
  },
];

const NASA_SHOT_STARTS = NASA_SHOTS.map((_, index) =>
  NASA_SHOTS.slice(0, index).reduce((total, shot) => total + shot.duration, 0),
);

const INTRO_QUESTION: Line = {
  cat: 'silver',
  text: l(
    'I am Silver, captain of the Stardust. Who is the highest-ranking officer here?',
    '我是銀白，星塵號艦長。這裡的最高指揮官是誰？',
  ),
};

const REPLY_LINES: Record<'command' | 'cadet', Line[]> = {
  command: [
    { cat: 'silver', text: l('Good. Courage is useful. Now use the same courage on the repair bill.', '很好。勇氣可嘉。現在請用同樣的勇氣面對維修帳單。') },
  ],
  cadet: [
    { cat: 'silver', text: l('Better. Cadets learn fast, and they are cheap.', '更好。見習生學得快，而且便宜。') },
  ],
};

const INTRO_REST: Line[] = [
  { cat: 'silver', text: l('From now on, you are the commander. Congratulations. Your salary is one tomato a day.', '從現在起，你就是指揮官。恭喜升遷，薪水是每天一顆番茄。') },
  { cat: 'ginger', text: l('What about me?', '那我呢？') },
  { cat: 'silver', text: l('You are the cook. The tomatoes are yours to grow.', '你是廚師，番茄歸你種。') },
  { cat: 'ginger', text: l('...Fair.', '……合理。') },
  { cat: 'shadow', text: l('Shadow, navigator. Sorry about your solar panels. I will fix them. ...Probably.', '我是暗影，導航員。抱歉撞壞了你們的太陽能板。我會修。……大概。') },
  { cat: 'silver', text: l('Probably?', '大概？') },
  { cat: 'shadow', text: l('An engineer’s “probably” is sincere. “Definitely” is a lie.', '工程師的「大概」是很有誠意的。「一定」是騙人的。') },
  { cat: 'ginger', text: l('Ginger, cook. Where is your fridge? I am hungry.', '我是金桔，廚師。你們的冰箱在哪裡？我餓了。') },
  { cat: 'narrator', text: l('Mars has no fridge.', '火星沒有冰箱。') },
  { cat: 'ginger', text: l('What? We are doomed.', '什麼？那我們完了。') },
  { cat: 'silver', text: l('We just got here.', '我們才剛到。') },
  { cat: 'ginger', text: l('All the more reason to eat first.', '所以更要先吃飽。') },
  { cat: 'silver', text: l('Before you eat, walk slowly. Months in space made us weaker.', '吃飽之前，先慢慢走。在太空待了好幾個月，我們的身體變弱了。') },
];

const MAP_LINES: Line[] = [
  { cat: 'shadow', text: l('This is the map. Here is Meowstar. Here is Mars. And here is the solar panel we broke.', '這是星圖。這裡是喵星。這裡是火星。這裡是我們撞壞的太陽能板。') },
  { cat: 'silver', text: l('You do not need to mark that one.', '最後那個不用標。') },
  { cat: 'shadow', text: l('For the record.', '要做紀錄。') },
  { cat: 'shadow', text: l('The supply ship arrives in seven days with engine parts. Until then, we cannot go home.', '補給船七天後到，會帶來星塵號的引擎零件。在那之前，我們回不了家。') },
  { cat: 'ginger', text: l('So we survive seven days together?', '所以我們要一起活過七天？') },
  { cat: 'silver', text: l('Correct. The regular crew will be coming back too.', '正式隊員也會一起回來。') },
  { cat: 'ginger', text: l('Will they bring snacks?', '他們會帶零食嗎？') },
  { cat: 'silver', text: l('...I will add that to the mission list.', '……我會把這個問題列入任務清單。') },
];

interface Tap {
  id: 'power' | 'lifeSupport' | 'shield';
  icon: string;
  place: Localized;
  lines: Line[];
}

const TAPS: Tap[] = [
  {
    id: 'power',
    icon: '⚡',
    place: l('Solar array', '太陽能陣列'),
    lines: [
      { cat: 'shadow', text: l('Power first. No power means no oxygen, no heat, and no heated blanket.', '電力優先。沒有電，氧氣、暖氣、還有我的加熱毯都會停。') },
      { cat: 'silver', text: l('The outpost does not have a heated blanket.', '基地沒有加熱毯。') },
      { cat: 'shadow', text: l('That is why I said first.', '所以我說「優先」。') },
    ],
  },
  {
    id: 'lifeSupport',
    icon: '💧',
    place: l('Greenhouse', '溫室'),
    lines: [
      { cat: 'ginger', text: l('Food and water. I will bring the greenhouse back to life. The first tomato is mine.', '食物和水。我會讓溫室活過來。第一顆番茄是我的。') },
      { cat: 'silver', text: l('It is communal property.', '那是公共財產。') },
      { cat: 'ginger', text: l('I grew it.', '我種的。') },
    ],
  },
  {
    id: 'shield',
    icon: '🛡️',
    place: l('Outer wall', '外牆'),
    lines: [
      { cat: 'silver', text: l('The {{atmosphere}} is too thin to protect us. The outer wall is our shield.', '火星的{{atmosphere}}太稀薄，保護不了我們。防護外牆就是我們的護盾。') },
      { cat: 'ginger', text: l('And my sunbathing spot.', '也是我的曬太陽區。') },
      { cat: 'silver', text: l('You cannot sunbathe on Mars. You would become roast orange cat.', '你不能在火星曬太陽。你會變成烤橘貓。') },
      { cat: 'ginger', text: l('...Then I will wear sunscreen.', '……那我塗防曬。') },
    ],
  },
];

const TAP_TERMS: Record<Tap['id'], string> = {
  power: 'solarPower',
  lifeSupport: 'greenhouse',
  shield: 'radiationShielding',
};

const LANDER_PROMPT = {
  eyebrow: l('Optional training · Landing', '選修訓練 · 著陸'),
  title: l('Practice the landing?', '要練習著陸嗎？'),
  body: l(
    'The Stardust is down, but you can practice steering through real Mars wind before Sol 1.',
    '星塵號已經迫降，但在第一天開始前，你可以先用真實的火星風場練習著陸。',
  ),
  note: l(
    'Real NASA Perseverance MEDA weather · Gale Crater map',
    '真實 NASA Perseverance MEDA 風場 · 蓋爾隕石坑地圖',
  ),
  start: l('Start practice', '開始練習'),
  later: l('Not now', '先不用'),
  practice: l('Practice landing', '練習著陸'),
};

const READY_LINES: Line[] = [
  { cat: 'silver', text: l('Seven Mars days. Every choice has a cost. Ready, Commander?', '七個火星日。每個選擇都有代價。準備好了嗎，指揮官？') },
  { cat: 'ginger', text: l('Wait. Can I eat one tomato first?', '等等，我可以先吃一顆番茄嗎？') },
  { cat: 'silver', text: l('No.', '不行。') },
  { cat: 'ginger', text: l('That is the cost.', '這就是代價。') },
];

/** Terms render as read-only text on lines that are no longer the current one. */
function stripTerms(text: string, lang: Lang): string {
  return text.replace(/\{\{([a-zA-Z]+)\}\}/g, (_, id: string) => {
    const card = getKnowledgeCard(id);
    return card ? card.term[lang] : id;
  });
}

function DialogueLine({
  line,
  lang,
  onTerm,
  interactive = true,
}: {
  line: Line;
  lang: Lang;
  onTerm: (id: string) => void;
  interactive?: boolean;
}) {
  const body = interactive ? (
    <RichText text={line.text[lang]} lang={lang} onTerm={onTerm} />
  ) : (
    stripTerms(line.text[lang], lang)
  );

  if (line.cat === 'narrator') {
    return <p className="story-narration">{body}</p>;
  }

  return (
    <div className={`story-line story-line-${line.cat}`}>
      <img
        className="story-avatar"
        src={`/brand/avatar-${line.cat}-512.webp`}
        alt=""
        aria-hidden="true"
      />
      <div>
        <strong className="story-speaker">{SPEAKER_NAMES[line.cat]}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}

function RadioLine({
  line,
  lang,
  onTerm,
  past = false,
}: {
  line: Line;
  lang: Lang;
  onTerm: (id: string) => void;
  past?: boolean;
}) {
  return (
    <p
      className={`story-radio-line story-radio-${line.cat}${
        past ? ' story-radio-past story-past' : ''
      }`}
    >
      {line.cat === 'narrator' ? null : (
        <strong>{SPEAKER_NAMES[line.cat]}: </strong>
      )}
      {past ? (
        stripTerms(line.text[lang], lang)
      ) : (
        <RichText text={line.text[lang]} lang={lang} onTerm={onTerm} />
      )}
    </p>
  );
}

function PlainLine({
  line,
  lang,
  onTerm,
  past = false,
}: {
  line: Line;
  lang: Lang;
  onTerm: (id: string) => void;
  past?: boolean;
}) {
  return (
    <p className={past ? 'story-final-line story-past' : 'story-final-line'}>
      {line.cat === 'narrator' ? null : (
        <>
          <strong>{SPEAKER_NAMES[line.cat]}:</strong>{' '}
        </>
      )}
      {past ? (
        stripTerms(line.text[lang], lang)
      ) : (
        <RichText text={line.text[lang]} lang={lang} onTerm={onTerm} />
      )}
    </p>
  );
}

interface DialogueSequenceProps {
  lines: Line[];
  lang: Lang;
  onTerm: (id: string) => void;
  variant?: 'chat' | 'radio' | 'plain';
  cta?: string;
  onCta?: () => void;
  ctaTestId?: string;
  ctaClassName?: string;
  between?: ReactNode;
}

/**
 * Shows one cat line at a time. The previous line stays on screen, dimmed and
 * non-interactive, on roomy layouts; compact landscape hides it so the panel
 * keeps to a single line. On the last line the CTA replaces "Next".
 */
function DialogueSequence({
  lines,
  lang,
  onTerm,
  variant = 'chat',
  cta,
  onCta,
  ctaTestId = 'opening-next',
  ctaClassName = 'primary-button',
  between,
}: DialogueSequenceProps) {
  const [step, setStep] = useState(0);
  const current = lines[step];
  const previous = step > 0 ? lines[step - 1] : null;
  const isLast = step === lines.length - 1;

  const renderLine = (line: Line, past: boolean) => {
    if (variant === 'radio') {
      return <RadioLine line={line} lang={lang} onTerm={onTerm} past={past} />;
    }
    if (variant === 'plain') {
      return <PlainLine line={line} lang={lang} onTerm={onTerm} past={past} />;
    }
    return (
      <DialogueLine
        line={line}
        lang={lang}
        onTerm={onTerm}
        interactive={!past}
      />
    );
  };

  return (
    <>
      <div className="story-chat" aria-live="polite">
        {previous && (
          <div className="story-past" aria-hidden="true">
            {renderLine(previous, true)}
          </div>
        )}
        <div className="story-chat-current" data-testid="dialogue-current" key={step}>
          {renderLine(current, false)}
        </div>
      </div>
      {between}
      {isLast ? (
        cta && onCta ? (
          <button
            type="button"
            className={ctaClassName}
            data-testid={ctaTestId}
            onClick={onCta}
          >
            {cta}
          </button>
        ) : null
      ) : (
        <button
          type="button"
          className="primary-button"
          data-testid="dialogue-next"
          onClick={() => setStep((value) => value + 1)}
        >
          {lang === 'en' ? 'Next' : '下一句'}
        </button>
      )}
    </>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

interface StoryOpeningProps {
  lang: Lang;
  paused?: boolean;
  onDone: () => void;
  onTerm: (cardId: string) => void;
}

/**
 * The playable opening from docs/wireframes.md §10. Six scenes, skippable,
 * with three resource taps before Sol 1. Each cat speaks one line at a time;
 * "Next" advances. The `?scene=opening2` video shot is a separate component
 * and is not affected by this flow.
 */
export function StoryOpening({ lang, paused = false, onDone, onTerm }: StoryOpeningProps) {
  const [scene, setScene] = useState(1);
  const [reply, setReply] = useState<'command' | 'cadet' | null>(null);
  const [tapped, setTapped] = useState<Tap['id'][]>([]);
  const [lastTap, setLastTap] = useState<Tap['id'] | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const [nasaShot, setNasaShot] = useState(0);
  const [nasaDone, setNasaDone] = useState(reduceMotion);
  const videoRef = useRef<HTMLVideoElement>(null);
  const crashStarted = useRef(false);
  const [landerPromptOpen, setLanderPromptOpen] = useState(false);
  const [landerOpen, setLanderOpen] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const landerPromptShown = useRef(false);

  const askLander = useCallback(() => {
    if (landerPromptShown.current) return;
    landerPromptShown.current = true;
    setLanderPromptOpen(true);
  }, []);
  const closeLanderPrompt = useCallback(() => setLanderPromptOpen(false), []);
  const openLander = useCallback(() => {
    setLanderPromptOpen(false);
    setLanderOpen(true);
  }, []);
  const closeLander = useCallback(() => setLanderOpen(false), []);

  useEffect(() => {
    if (window.scrollY > 0) window.scrollTo(0, 0);
  }, [scene]);

  useEffect(() => {
    if (scene !== 1) return;
    const timer = window.setTimeout(() => setScene(2), 5000);
    return () => window.clearTimeout(timer);
  }, [scene]);

  const tap = (id: Tap['id']) => {
    setTapped((current) => (current.includes(id) ? current : [...current, id]));
    setLastTap(id);
  };

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      const playback = video.play?.();
      if (playback) void playback.catch(() => undefined);
    } else {
      video.pause?.();
    }
  };

  const tapLines = lastTap ? TAPS.find((item) => item.id === lastTap)!.lines : [];
  const introDone = reply !== null;
  const allTapped = tapped.length === TAPS.length;

  useEffect(() => {
    if (!allTapped) return;
    if (document.documentElement.scrollHeight <= window.innerHeight) return;
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [allTapped]);

  // Pause the crash clip while a knowledge card is open and for reduced motion.
  useEffect(() => {
    if (!paused && !reduceMotion) return;
    videoRef.current?.pause?.();
  }, [paused, reduceMotion]);

  // Step through the NASA stills; the crash clip waits until they finish.
  useEffect(() => {
    if (scene !== 2 || nasaDone || paused) return;
    const shot = NASA_SHOTS[nasaShot];
    const timer = window.setTimeout(() => {
      if (nasaShot + 1 >= NASA_SHOTS.length) {
        setNasaDone(true);
      } else {
        setNasaShot(nasaShot + 1);
      }
    }, shot.duration);
    return () => window.clearTimeout(timer);
  }, [nasaShot, nasaDone, scene, paused]);

  useEffect(() => {
    if (reduceMotion) setNasaDone(true);
  }, [reduceMotion]);

  // Reduced-motion users skip the autoplay, but should still get the optional
  // landing practice invitation after the NASA montage.
  useEffect(() => {
    if (scene !== 2 || !reduceMotion || !nasaDone) return;
    setVideoEnded(true);
    askLander();
  }, [scene, reduceMotion, nasaDone, askLander]);

  // After the montage, play the clip from its first frame. Only once:
  // opening and closing a knowledge card must not restart the clip.
  useEffect(() => {
    if (!nasaDone || reduceMotion || paused || crashStarted.current) return;
    const video = videoRef.current;
    if (!video) return;
    crashStarted.current = true;
    video.currentTime = 0;
    const playback = video.play?.();
    if (playback) void playback.catch(() => undefined);
  }, [nasaDone, reduceMotion, paused]);

  return (
    <main
      className={`story-screen story-scene-${scene} ${paused ? 'is-paused' : ''}`}
      data-testid="opening-story"
    >
      <button
        type="button"
        className="ghost-button story-skip"
        data-testid="opening-skip"
        onClick={onDone}
      >
        {lang === 'en' ? 'Skip story' : '跳過故事'}
      </button>

      <div className="story-progress" aria-hidden="true">
        {SCENE_TITLES.map((_, index) => (
          <span
            key={index}
            className={index + 1 <= scene ? 'story-dot is-on' : 'story-dot'}
          />
        ))}
      </div>

      {scene === 1 && (
        <section className="story-stage story-stage-photo">
          <img className="story-photo" src={marsLandscape} alt="" />
          <div className="story-photo-shade" aria-hidden="true" />
          <div className="story-panel story-caption">
            <p className="eyebrow">Sol 0 · Hope-1</p>
            <h1>{SCENE_TITLES[0][lang]}</h1>
            <DialogueLine line={SCENE_ONE} lang={lang} onTerm={onTerm} />
            <button
              type="button"
              className="primary-button"
              data-testid="opening-next"
              onClick={() => setScene(2)}
            >
              {lang === 'en' ? 'Next' : '下一幕'}
            </button>
            <p className="story-credit">
              {lang === 'en'
                ? 'NASA/JPL-Caltech · Curiosity Navcam · original image is black and white'
                : 'NASA/JPL-Caltech · Curiosity 導航相機 · 原始影像為黑白'}
            </p>
          </div>
        </section>
      )}

      {scene === 2 && (
        <section className="story-stage story-stage-crash" data-testid="opening-scene2-story">
          <video
            ref={videoRef}
            className="opening-mars opening-mars-video"
            data-testid="opening-scene2-video"
            src={scene2Video}
            poster={crashScene}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onEnded={() => {
              setVideoPlaying(false);
              setVideoEnded(true);
              askLander();
            }}
          />
          {!nasaDone && (
            <div className="nasa-intro" data-testid="opening-scene2-intro">
              {NASA_SHOTS.map((shot, index) => (
                <figure
                  key={shot.key}
                  className={`nasa-shot ${index === nasaShot ? 'is-current' : ''} ${
                    shot.fit === 'contain' ? 'is-contain' : ''
                  }`}
                  data-testid={`nasa-shot-${shot.key}`}
                  aria-hidden={index !== nasaShot}
                >
                  <img
                    src={shot.src}
                    alt={index === nasaShot ? shot.alt[lang] : ''}
                    draggable={false}
                    style={{ animationDelay: `${NASA_SHOT_STARTS[index]}ms` }}
                  />
                  {index === nasaShot && (
                    <figcaption className="nasa-credit">{shot.credit}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
          {nasaDone && (
            <button
              type="button"
              className="ghost-button story-video-toggle"
              data-testid="opening-scene2-video-toggle"
              aria-label={
                videoPlaying
                  ? lang === 'en' ? 'Pause the crash video' : '暫停迫降影片'
                  : lang === 'en' ? 'Play the crash video' : '播放迫降影片'
              }
              onClick={toggleVideo}
            >
              {videoPlaying
                ? lang === 'en' ? 'Pause' : '暫停'
                : lang === 'en' ? 'Play' : '播放'}
            </button>
          )}
          <div className="story-radio">
            <p className="eyebrow">
              <span className="story-live-dot" aria-hidden="true" />
              {lang === 'en' ? 'Radio · Stardust' : '無線電 · 星塵號'}
            </p>
            <DialogueSequence
              lines={CRASH_LINES}
              lang={lang}
              onTerm={onTerm}
              variant="radio"
              cta={lang === 'en' ? 'Continue' : '繼續'}
              onCta={() => setScene(3)}
            />
            {videoEnded && (
              <button
                type="button"
                className="ghost-button story-lander-reopen"
                data-testid="landing-practice-open"
                onClick={openLander}
              >
                {LANDER_PROMPT.practice[lang]}
              </button>
            )}
          </div>
        </section>
      )}

      {scene === 3 && (
        <section className="story-stage story-stage-cats">
          <img className="story-lineup" src={lineupScene} alt="" />
          <div className="story-panel story-dialogue">
            <p className="eyebrow">{lang === 'en' ? 'Scene 3 · Three cats' : '第 3 幕 · 三隻貓'}</p>
            <div
              className={introDone ? 'story-past' : undefined}
              aria-hidden={introDone}
            >
              <DialogueLine
                line={INTRO_QUESTION}
                lang={lang}
                onTerm={onTerm}
                interactive={!introDone}
              />
            </div>
            {!introDone && (
              <div className="story-replies">
                <button
                  type="button"
                  className="choice-button"
                  data-testid="opening-reply-command"
                  onClick={() => setReply('command')}
                >
                  {lang === 'en' ? 'I am the commander!' : '我就是指揮官！'}
                </button>
                <button
                  type="button"
                  className="choice-button"
                  data-testid="opening-reply-cadet"
                  onClick={() => setReply('cadet')}
                >
                  {lang === 'en' ? 'I am only a cadet...' : '我只是見習生……'}
                </button>
              </div>
            )}
            {reply && (
              <DialogueSequence
                key={reply}
                lines={[...REPLY_LINES[reply], ...INTRO_REST]}
                lang={lang}
                onTerm={onTerm}
                cta={lang === 'en' ? 'Continue' : '繼續'}
                onCta={() => setScene(4)}
              />
            )}
          </div>
        </section>
      )}

      {scene === 4 && (
        <section className="story-stage story-stage-map">
          <div className="story-map" aria-hidden="true">
            <span className="story-map-dot story-map-meowstar" />
            <span className="story-map-dot story-map-mars" />
            <span className="story-map-dot story-map-panel" />
            <span className="story-map-route" />
            <span className="story-map-label story-map-label-meowstar">Meowstar</span>
            <span className="story-map-label story-map-label-mars">Mars</span>
            <span className="story-map-label story-map-label-panel">?</span>
          </div>
          <div className="story-panel story-dialogue">
            <p className="eyebrow">{lang === 'en' ? 'Scene 4 · Seven days' : '第 4 幕 · 七天'}</p>
            <DialogueSequence
              lines={MAP_LINES}
              lang={lang}
              onTerm={onTerm}
              between={
                <div className="story-countdown" aria-hidden="true">
                  {Array.from({ length: 7 }, (_, index) => (
                    <span key={index} className="story-day" />
                  ))}
                  <strong>7 SOLS</strong>
                </div>
              }
              cta={lang === 'en' ? 'Continue' : '繼續'}
              onCta={() => setScene(5)}
            />
          </div>
        </section>
      )}

      {scene === 5 && (
        <section className="story-stage story-stage-taps">
          <div className="story-tap-head">
            <p className="eyebrow">{lang === 'en' ? 'Scene 5 · Three systems' : '第 5 幕 · 三個系統'}</p>
            <h1>{lang === 'en' ? 'Build the outpost' : '組裝基地'}</h1>
            <p>
              {lang === 'en'
                ? 'Tap each system to bring it online.'
                : '點一下每個系統，把它接上基地。'}
            </p>
          </div>
          <div className="story-tap-grid">
            {TAPS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`story-tap ${tapped.includes(item.id) ? 'is-on' : ''}`}
                data-testid={`opening-tap-${item.id}`}
                onClick={() => tap(item.id)}
              >
                <span className="story-tap-icon" aria-hidden="true">{item.icon}</span>
                <strong>{item.place[lang]}</strong>
                <small>
                  {tapped.includes(item.id)
                    ? lang === 'en' ? 'Online' : '已上線'
                    : lang === 'en' ? 'Tap to connect' : '點擊接上'}
                </small>
              </button>
            ))}
          </div>
          <div className="story-mini-hud" aria-hidden="true">
            {TAPS.map((item) => (
              <span key={item.id} className={tapped.includes(item.id) ? 'is-on' : ''}>
                {item.icon} {item.place[lang]}
              </span>
            ))}
          </div>
          <div className="story-panel story-tap-dialogue">
            {lastTap ? (
              <DialogueSequence
                key={lastTap}
                lines={tapLines}
                lang={lang}
                onTerm={onTerm}
              />
            ) : (
              <p className="muted">
                {lang === 'en'
                  ? 'Each tap adds one system to your HUD.'
                  : '每點一個，HUD 就會多一條資源。'}
              </p>
            )}
            {lastTap && (
              <p className="story-term-hint">
                {lang === 'en' ? 'Dotted words open a knowledge card.' : '虛線字可以點開知識卡。'}
                {' '}
                <RichText
                  text={`{{${TAP_TERMS[lastTap]}}}`}
                  lang={lang}
                  onTerm={onTerm}
                />
              </p>
            )}
          </div>
          <button
            type="button"
            className="primary-button"
            data-testid="opening-next"
            disabled={!allTapped}
            onClick={() => setScene(6)}
          >
            {lang === 'en' ? 'Continue' : '繼續'}
          </button>
        </section>
      )}

      {scene === 6 && (
        <section className="story-stage story-stage-ready">
          <div className="story-panel story-ready">
            <p className="eyebrow">{lang === 'en' ? 'Scene 6 · Ready?' : '第 6 幕 · 準備好了嗎？'}</p>
            <h1>{lang === 'en' ? 'Seven sols at Hope-1' : '希望一號的七個火星日'}</h1>
            <div className="story-bars" aria-hidden="true">
              <span style={{ width: '100%' }}>⚡</span>
              <span style={{ width: '82%' }}>💧</span>
              <span style={{ width: '66%' }}>🛡️</span>
            </div>
            <DialogueSequence
              lines={READY_LINES}
              lang={lang}
              onTerm={onTerm}
              variant="plain"
              cta={lang === 'en' ? 'Start the mission' : '開始任務'}
              ctaTestId="opening-start"
              ctaClassName="primary-button start-button"
              onCta={onDone}
            />
          </div>
        </section>
      )}

      <p className="story-footnote">
        {lang === 'en'
          ? 'Meowstar is fiction. The solar flare and Mars data are real. The crash is a training simulation.'
          : '喵星是虛構的，太陽閃焰與火星資料是真的；迫降是訓練模擬。'}
      </p>

      {landerPromptOpen && !landerOpen && (
        <Modal
          title={LANDER_PROMPT.title[lang]}
          onClose={closeLanderPrompt}
          testId="landing-practice-prompt"
        >
          <div className="story-lander-prompt">
            <div className="story-lander-hero">
              <img src="/brand/avatar-silver-512.webp" alt="" />
              <div>
                <p className="story-lander-note">{LANDER_PROMPT.eyebrow[lang]}</p>
                <p>{LANDER_PROMPT.body[lang]}</p>
                <p className="story-lander-note">{LANDER_PROMPT.note[lang]}</p>
              </div>
            </div>
            <div className="story-lander-actions">
              <button
                type="button"
                className="primary-button"
                data-testid="landing-practice-start"
                onClick={openLander}
                autoFocus
              >
                {LANDER_PROMPT.start[lang]}
              </button>
              <button
                type="button"
                className="ghost-button"
                data-testid="landing-practice-later"
                onClick={closeLanderPrompt}
              >
                {LANDER_PROMPT.later[lang]}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {landerOpen && <LanderOverlay initialLang={lang} onClose={closeLander} />}
    </main>
  );
}
