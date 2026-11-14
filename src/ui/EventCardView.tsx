import { EVENT_BY_ID } from '../game/events';
import type { CatId, Choice, EffectMap, GameState, ResourceKey } from '../game/types';
import { RESOURCE_LABEL_KEY, CAT_NAMES, t } from '../i18n';
import { RichText } from './RichText';

const CATEGORY_LABEL: Record<string, { en: string; 'zh-TW': string }> = {
  power: { en: 'Power', 'zh-TW': '電力' },
  lifeSupport: { en: 'Life support', 'zh-TW': '生命維持' },
  shield: { en: 'Shielding', 'zh-TW': '輻射遮蔽' },
  food: { en: 'Food', 'zh-TW': '食物' },
  comms: { en: 'Communications', 'zh-TW': '通訊' },
  science: { en: 'Science', 'zh-TW': '科學' },
  morale: { en: 'Morale', 'zh-TW': '士氣' },
};

function signed(value: number): string {
  return value > 0 ? `+${value}` : `−${Math.abs(value)}`;
}

function EffectChips({
  effects,
  lang,
}: {
  effects: EffectMap;
  lang: GameState['lang'];
}) {
  const entries = Object.entries(effects) as [ResourceKey, number][];
  if (entries.length === 0) return <span className="muted">—</span>;
  return (
    <span className="effect-chips">
      {entries.map(([key, value]) => (
        <span className={value < 0 ? 'effect-chip effect-negative' : 'effect-chip'} key={key}>
          {t(lang, RESOURCE_LABEL_KEY[key])} {signed(value)}
        </span>
      ))}
    </span>
  );
}

interface EventCardViewProps {
  state: GameState;
  onChoose: (choiceId: string) => void;
  onAssist: (cat: CatId, variant?: 'power' | 'food' | 'lifeSupport') => void;
  onTerm: (cardId: string) => void;
  onContinue: () => void;
  onOpenCard: (cardId: string) => void;
}

export function EventCardView({
  state,
  onChoose,
  onAssist,
  onTerm,
  onContinue,
  onOpenCard,
}: EventCardViewProps) {
  const event = state.currentEventId ? EVENT_BY_ID.get(state.currentEventId) : undefined;
  if (!event) return null;

  const lang = state.lang;
  const chosen: Choice | undefined = event.choices.find(
    (choice) => choice.id === state.lastChoiceId,
  );
  const isChoice = state.phase === 'choice';
  const isResult = state.phase === 'result';
  const category = CATEGORY_LABEL[event.category] ?? CATEGORY_LABEL.power;

  return (
    <main className={`event-shell ${isResult ? 'is-result' : ''}`}>
      <article className="event-card" data-testid={`event-card-${event.id}`}>
        <header className="event-head">
          <img
            className="cat-avatar"
            src={`/brand/avatar-${event.cat}-512.webp`}
            alt={CAT_NAMES[event.cat][lang]}
          />
          <div>
            <p className="eyebrow">
              {category[lang]} · {t(lang, 'briefing.sol', { sol: state.sol })}
            </p>
            <h1>{event.title[lang]}</h1>
          </div>
        </header>

        <p className="event-brief">
          <RichText text={event.brief[lang]} lang={lang} onTerm={onTerm} />
        </p>

        {isChoice && (
          <>
            <h2 className="section-label">{t(lang, 'event.choose')}</h2>
            <div className="choices">
              {event.choices.map((choice) => {
                const charges = choice.requires ? state.catCharges[choice.requires] : 1;
                const disabled = Boolean(choice.requires && charges <= 0);
                return (
                  <button
                    type="button"
                    className="choice-button"
                    key={choice.id}
                    data-testid={`choice-${choice.id}`}
                    disabled={disabled}
                    onClick={() => onChoose(choice.id)}
                  >
                    <span className="choice-label">{choice.label[lang]}</span>
                    <EffectChips effects={choice.effects} lang={lang} />
                    <span className="choice-meta">
                      {choice.risk && (
                        <span className="risk-label">
                          {t(lang, 'event.risk', {
                            percent: Math.round(choice.risk.chance * 100),
                          })}
                        </span>
                      )}
                      {choice.requires && (
                        <span>
                          {t(lang, 'event.requires', {
                            cat: CAT_NAMES[choice.requires][lang],
                          })}{' '}
                          · {t(lang, 'assist.left', { count: charges })}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <section className="assists">
              <h2 className="section-label">{t(lang, 'assist.title')}</h2>
              <div className="assist-row">
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.silver <= 0}
                  onClick={() => onAssist('silver')}
                >
                  <img className="assist-avatar" src="/brand/avatar-silver-512.webp" alt="" /> {t(lang, 'assist.silver')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.silver })}</small>
                </button>
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.shadow <= 0}
                  onClick={() => onAssist('shadow')}
                >
                  <img className="assist-avatar" src="/brand/avatar-shadow-512.webp" alt="" /> {t(lang, 'assist.shadow')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.shadow })}</small>
                </button>
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.ginger <= 0}
                  onClick={() => onAssist('ginger', 'food')}
                >
                  <img className="assist-avatar" src="/brand/avatar-ginger-512.webp" alt="" /> {t(lang, 'assist.gingerFood')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.ginger })}</small>
                </button>
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.ginger <= 0}
                  onClick={() => onAssist('ginger', 'lifeSupport')}
                >
                  <img className="assist-avatar" src="/brand/avatar-ginger-512.webp" alt="" /> {t(lang, 'assist.gingerLife')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.ginger })}</small>
                </button>
              </div>
            </section>
          </>
        )}

        {isResult && (
          <section className="result-panel" data-testid="result-panel">
            <p className={`result-status ${state.lastSuccess ? 'result-ok' : 'result-bad'}`}>
              {state.lastSuccess ? t(lang, 'event.success') : t(lang, 'event.failed')}
            </p>
            <h2>{t(lang, 'event.result')}</h2>
            <p className="result-outcome">
              <RichText text={state.lastOutcome?.[lang] ?? ''} lang={lang} onTerm={onTerm} />
            </p>
            <div className="result-effects">
              <EffectChips effects={state.lastEffects ?? {}} lang={lang} />
            </div>
            {chosen?.knowledgeCard && (
              <button
                type="button"
                className="knowledge-link"
                onClick={() => onOpenCard(chosen.knowledgeCard!)}
              >
                ＋ {t(lang, 'event.newCard')}
              </button>
            )}
            <button
              type="button"
              className="primary-button continue-button"
              data-testid="continue-button"
              onClick={onContinue}
            >
              {t(lang, 'event.continue')}
            </button>
          </section>
        )}
      </article>
    </main>
  );
}
