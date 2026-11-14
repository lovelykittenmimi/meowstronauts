import { BACKPACK_SIZE } from '../game/balance';
import { getKnowledgeCard } from '../game/knowledge';
import type { Lang } from '../game/types';
import { t } from '../i18n';
import { Modal } from './Modal';

interface BackpackProps {
  lang: Lang;
  collected: string[];
  onClose: () => void;
  onOpenCard: (cardId: string) => void;
}

export function Backpack({ lang, collected, onClose, onOpenCard }: BackpackProps) {
  const slots = Array.from({ length: BACKPACK_SIZE }, (_, index) => collected[index]);

  return (
    <Modal
      title={`${t(lang, 'backpack.title')} · ${collected.length} / ${BACKPACK_SIZE}`}
      onClose={onClose}
      testId="backpack-panel"
      wide
    >
      <div className="backpack-grid">
        {slots.map((cardId, index) => {
          if (!cardId) {
            return (
              <div className="backpack-slot backpack-slot-empty" key={`empty-${index}`}>
                <span aria-hidden="true">?</span>
                <small>{t(lang, 'backpack.empty')}</small>
              </div>
            );
          }
          const card = getKnowledgeCard(cardId);
          if (!card) return null;
          return (
            <button
              type="button"
              className="backpack-slot"
              key={cardId}
              onClick={() => onOpenCard(cardId)}
            >
              <span aria-hidden="true">📖</span>
              <strong>{card.term[lang]}</strong>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
