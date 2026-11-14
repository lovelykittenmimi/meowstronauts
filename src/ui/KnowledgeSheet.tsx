import { getKnowledgeCard, termSlug } from '../game/knowledge';
import type { Lang } from '../game/types';
import { t } from '../i18n';
import { Modal } from './Modal';

interface KnowledgeSheetProps {
  cardId: string;
  lang: Lang;
  collected: boolean;
  onClose: () => void;
  onCollect: (cardId: string) => void;
}

export function KnowledgeSheet({
  cardId,
  lang,
  collected,
  onClose,
  onCollect,
}: KnowledgeSheetProps) {
  const card = getKnowledgeCard(cardId);
  if (!card) return null;

  return (
    <Modal title={t(lang, 'knowledge.title')} onClose={onClose} testId="knowledge-card">
      <article
        className="knowledge-card"
        data-testid={`knowledge-card-${termSlug(card.id)}`}
      >
        <p className="eyebrow">{t(lang, 'knowledge.title')}</p>
        <h3>{card.term[lang]}</h3>

        <section>
          <h4>{t(lang, 'knowledge.short')}</h4>
          <p>{card.short[lang]}</p>
        </section>
        <section>
          <h4>{t(lang, 'knowledge.example')}</h4>
          <p>{card.example[lang]}</p>
        </section>
        <section>
          <h4>{t(lang, 'knowledge.why')}</h4>
          <p>{card.why[lang]}</p>
        </section>

        <section className="knowledge-sources">
          <h4>{t(lang, 'knowledge.sources')}</h4>
          {card.sources.map((source) => (
            <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
              {source.id} · {source.label}
            </a>
          ))}
        </section>

        <div className="knowledge-actions">
          <button
            type="button"
            className="primary-button"
            data-testid="knowledge-collect"
            disabled={collected}
            onClick={() => onCollect(card.id)}
          >
            {collected ? `✓ ${t(lang, 'knowledge.collected')}` : t(lang, 'knowledge.collect')}
          </button>
          <button type="button" className="ghost-button" onClick={onClose}>
            {t(lang, 'knowledge.close')}
          </button>
        </div>
      </article>
    </Modal>
  );
}
