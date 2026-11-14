import { getKnowledgeCard, termSlug } from '../game/knowledge';
import type { Lang } from '../game/types';

interface RichTextProps {
  text: string;
  lang: Lang;
  onTerm: (id: string) => void;
}

export function RichText({ text, lang, onTerm }: RichTextProps) {
  const pieces = text.split(/(\{\{[a-zA-Z]+\}\})/g);

  return (
    <>
      {pieces.map((piece, index) => {
        const match = /^\{\{([a-zA-Z]+)\}\}$/.exec(piece);
        if (!match) return <span key={index}>{piece}</span>;

        const id = match[1];
        const card = getKnowledgeCard(id);
        if (!card) return <span key={index}>{id}</span>;

        return (
          <button
            key={index}
            type="button"
            className="term-link"
            data-testid={`term-${termSlug(id)}`}
            onClick={() => onTerm(id)}
          >
            {card.term[lang]}
            <span aria-hidden="true"> ↗</span>
          </button>
        );
      })}
    </>
  );
}
