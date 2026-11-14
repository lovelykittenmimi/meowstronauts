import { useEffect, useState } from 'react';
import marsLandscape from '../data/mars-photos/PIA26632.jpg';
import type { Lang, Localized } from '../game/types';
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
  { cat: 'narrator', text: l('The storm knocked out the antenna. Radio delay to Earth is about twelve minutes.', '風暴震歪了天線。地球的無線電單向延遲大約十二分鐘。') },
];

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
  { cat: 'silver', text: l('You are the cook. The tomatoes are yours to grow.', '你是廚師。番茄是你種的。') },
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
  { cat: 'silver', text: l('Correct. The adult crew comes back too.', '正確。成人隊員也會一起回來。') },
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
      { cat: 'silver', text: l('The {{atmosphere}} is too thin to protect us. Shielding is our shield.', '火星的{{atmosphere}}太稀薄，保護不了我們。遮蔽，是我們的盾。') },
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

function DialogueLine({
  line,
  lang,
  onTerm,
}: {
  line: Line;
  lang: Lang;
  onTerm: (id: string) => void;
}) {
  if (line.cat === 'narrator') {
    return (
      <p className="story-narration">
        <RichText text={line.text[lang]} lang={lang} onTerm={onTerm} />
      </p>
    );
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
        <p>
          <RichText text={line.text[lang]} lang={lang} onTerm={onTerm} />
        </p>
      </div>
    </div>
  );
}

interface StoryOpeningProps {
  lang: Lang;
  paused?: boolean;
  onDone: () => void;
  onTerm: (cardId: string) => void;
}

/**
 * The playable opening from docs/wireframes.md §10. Six scenes, skippable,
 * with three resource taps before Sol 1. The `?scene=opening2` video shot is
 * a separate component and is not affected by this flow.
 */
export function StoryOpening({ lang, paused = false, onDone, onTerm }: StoryOpeningProps) {
  const [scene, setScene] = useState(1);
  const [reply, setReply] = useState<'command' | 'cadet' | null>(null);
  const [tapped, setTapped] = useState<Tap['id'][]>([]);
  const [lastTap, setLastTap] = useState<Tap['id'] | null>(null);
  const [crashDone, setCrashDone] = useState(false);
  const [radioStep, setRadioStep] = useState(0);

  useEffect(() => {
    if (scene !== 1) return;
    const timer = window.setTimeout(() => setScene(2), 5000);
    return () => window.clearTimeout(timer);
  }, [scene]);

  useEffect(() => {
    if (scene !== 2 || paused) return;
    const timers = CRASH_LINES.map((_, index) =>
      window.setTimeout(
        () => setRadioStep((step) => Math.max(step, index + 1)),
        4000 + index * 2400,
      ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [scene, paused]);

  useEffect(() => {
    if (scene !== 2 || crashDone || paused) return;
    const timer = window.setTimeout(() => setCrashDone(true), 18000);
    return () => window.clearTimeout(timer);
  }, [scene, crashDone, paused]);

  const tap = (id: Tap['id']) => {
    setTapped((current) => (current.includes(id) ? current : [...current, id]));
    setLastTap(id);
  };

  const tapLines = lastTap ? TAPS.find((item) => item.id === lastTap)!.lines : [];
  const introDone = reply !== null;
  const allTapped = tapped.length === TAPS.length;

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
          </div>
        </section>
      )}

      {scene === 2 && (
        <section className="story-stage story-stage-crash" data-testid="opening-scene2-story">
          <div className="opening-stars" aria-hidden="true" />
          <div className="opening-sun" aria-hidden="true" />
          <div className="opening-flare" aria-hidden="true" />
          <img className="opening-mars" src={marsLandscape} alt="" />
          <div className="opening-ship" aria-hidden="true">
            <span />
          </div>
          <div className="story-radio">
            <p className="eyebrow">
              {lang === 'en' ? 'Radio · Stardust' : '無線電 · 星塵號'}
            </p>
            {CRASH_LINES.slice(0, radioStep).map((line, index) => (
              <p
                key={index}
                className={`story-radio-line story-radio-${line.cat}`}
              >
                {line.cat === 'narrator' ? null : (
                  <strong>{(line.cat === 'shadow' ? 'Shadow' : 'Ginger')}: </strong>
                )}
                <RichText text={line.text[lang]} lang={lang} onTerm={onTerm} />
              </p>
            ))}
            {crashDone ? (
              <button
                type="button"
                className="primary-button"
                data-testid="opening-next"
                onClick={() => setScene(3)}
              >
                {lang === 'en' ? 'Continue' : '繼續'}
              </button>
            ) : (
              <p className="story-wait" data-testid="opening-scene2-wait" />
            )}
          </div>
        </section>
      )}

      {scene === 3 && (
        <section className="story-stage story-stage-cats">
          <div className="story-cats" aria-hidden="true">
            <img className="story-cat story-cat-silver" src="/brand/full-silver-800.webp" alt="" />
            <img className="story-cat story-cat-ginger" src="/brand/full-ginger-800.webp" alt="" />
            <img className="story-cat story-cat-shadow" src="/brand/full-shadow-800.webp" alt="" />
          </div>
          <div className="story-panel story-dialogue">
            <p className="eyebrow">{lang === 'en' ? 'Scene 3 · Three cats' : '第 3 幕 · 三隻貓'}</p>
            <DialogueLine line={INTRO_QUESTION} lang={lang} onTerm={onTerm} />
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
            {reply && REPLY_LINES[reply].map((line, index) => (
              <DialogueLine key={index} line={line} lang={lang} onTerm={onTerm} />
            ))}
            {introDone && (
              <>
                {INTRO_REST.map((line, index) => (
                  <DialogueLine key={index} line={line} lang={lang} onTerm={onTerm} />
                ))}
                <button
                  type="button"
                  className="primary-button"
                  data-testid="opening-next"
                  onClick={() => setScene(4)}
                >
                  {lang === 'en' ? 'Continue' : '繼續'}
                </button>
              </>
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
            {MAP_LINES.map((line, index) => (
              <DialogueLine key={index} line={line} lang={lang} onTerm={onTerm} />
            ))}
            <div className="story-countdown" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <span key={index} className="story-day" />
              ))}
              <strong>7 SOLS</strong>
            </div>
            <button
              type="button"
              className="primary-button"
              data-testid="opening-next"
              onClick={() => setScene(5)}
            >
              {lang === 'en' ? 'Continue' : '繼續'}
            </button>
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
              tapLines.map((line, index) => (
                <DialogueLine key={index} line={line} lang={lang} onTerm={onTerm} />
              ))
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
            <p className="story-final-line">
              <strong>Silver:</strong>{' '}
              {lang === 'en'
                ? 'Seven Mars days. Every choice has a cost. Ready, Commander?'
                : '七個火星日。每個選擇都有代價。準備好了嗎，指揮官？'}
            </p>
            <p className="story-final-line">
              <strong>Ginger:</strong>{' '}
              {lang === 'en'
                ? 'Wait. Can I eat one tomato first?'
                : '等等，我可以先吃一顆番茄嗎？'}
            </p>
            <p className="story-final-line">
              <strong>Silver:</strong> {lang === 'en' ? 'No.' : '不行。'}
            </p>
            <p className="story-final-line">
              <strong>Ginger:</strong>{' '}
              {lang === 'en' ? 'That is the cost.' : '這就是代價。'}
            </p>
            <button
              type="button"
              className="primary-button start-button"
              data-testid="opening-start"
              onClick={onDone}
            >
              {lang === 'en' ? 'Start the mission' : '開始任務'}
            </button>
          </div>
        </section>
      )}

      <p className="story-footnote">
        {lang === 'en'
          ? 'Meowstar is fiction. The solar flare and Mars data are real. The crash is a training simulation.'
          : '喵星是虛構的，太陽閃焰與火星資料是真的；迫降是訓練模擬。'}
      </p>
    </main>
  );
}
