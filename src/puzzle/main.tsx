import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PuzzlePrototype } from './PuzzlePrototype';
import './puzzle.css';

const root = document.getElementById('puzzle-root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <PuzzlePrototype />
    </StrictMode>,
  );
}
