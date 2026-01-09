import { GameConstants, MainPageConstants } from '../../core/constants';
import { drawPuzzlePiece } from '../../utils/canvas-puzzle';
import { createElement } from '../../utils/dom';

import type { ShuffledWord } from '../../core/types';

export function createPuzzleArea(): HTMLElement {
  const area = createElement('div', { 
    className: 'puzzle-area', 
    attrs: { id: MainPageConstants.PuzzleAreaId }, 
  });
  
  for (let index = 0; index < GameConstants.TotalSentences; index += 1) {
    const row = createElement('div', { className: 'puzzle-row', dataset: { row: String(index) } });
    area.append(row);
  }
  return area;
}

export function createSourceArea(): HTMLElement {
  return createElement('div', { 
    className: 'source-area', 
    attrs: { id: MainPageConstants.SourceAreaId },
    text: 'Loading...',
  });
}

export function renderWordsToContainer(
  container: HTMLElement,
  words: ShuffledWord[], 
  bgImage: HTMLImageElement | undefined,
): void {
  container.replaceChildren();

  for (const item of words) {
    let cssClass = MainPageConstants.WordPieceClass;

    if (item.isFirst) {
      cssClass += ' puzzle-first';
    }
    if (item.isLast) {
      cssClass += ' puzzle-last';
    }

    const canvas = drawPuzzlePiece(
      item.word,
      item.drawWidth,
      bgImage,
      item.bgX,
      item.bgY,
      item.isFirst,
      item.isLast,
    );

    const wordElement = createElement('div', {
      className: cssClass,
      dataset: { 
        word: item.word,
        index: String(item.originalIndex),
      },
      style: {
        width: item.width,
      },
      attrs: { draggable: 'true' },
    });

    const canvasRealWidth = canvas.width;

    const scalePercent = (canvasRealWidth / item.drawWidth) * GameConstants.PercentageBase;

    canvas.style.position = 'absolute';
    canvas.style.top = '-1px';
    canvas.style.left = '-1px';
    canvas.style.height = 'calc(100% + 2px)';
    canvas.style.width = `${scalePercent}%`; 
    canvas.style.maxWidth = 'none';
    canvas.style.pointerEvents = 'none';

    wordElement.append(canvas);
    container.append(wordElement);
  }
}

export function highlightActiveRow(puzzleArea: HTMLElement, rowIndex: number): void {
  const rows = puzzleArea.querySelectorAll('.puzzle-row');
  rows.forEach((row) => { row.classList.remove('active-row'); });

  const currentRow = puzzleArea.querySelector(`[data-row="${rowIndex}"]`);
  if (currentRow) {
    currentRow.classList.add('active-row');
  }
}

export function getCurrentRowWords(puzzleArea: HTMLElement, rowIndex: number): string[] {
  const currentRow = puzzleArea.querySelector(`[data-row="${rowIndex}"]`);
  if (!currentRow) {
    return [];
  }
  
  const wordElements = [...currentRow.children];
  
  return wordElements.map((element) => {
    if (element instanceof HTMLElement && element.dataset.word) {
      return element.dataset.word;
    }
    return '';
  });
}

export function setValidationStyles(
  puzzleArea: HTMLElement, 
  rowIndex: number, 
  results: boolean[],
): void {
  const currentRow = puzzleArea.querySelector(`[data-row="${rowIndex}"]`);
  if (!currentRow) {return;}

  const wordElements = [...currentRow.children];

  wordElements.forEach((element, index) => {
    const isCorrect = results[index];

    if (isCorrect) {
      element.classList.add(MainPageConstants.ClassSuccess);
      element.classList.remove(MainPageConstants.ClassError);
    } else {
      element.classList.add(MainPageConstants.ClassError);
      element.classList.remove(MainPageConstants.ClassSuccess);
    }
  });
}

export function clearValidationStyles(puzzleArea: HTMLElement, rowIndex: number): void {
  const currentRow = puzzleArea.querySelector(`[data-row="${rowIndex}"]`);
  if (!currentRow) { return; }

  const wordElements = [...currentRow.children];
  wordElements.forEach((element) => {
    element.classList.remove(MainPageConstants.ClassSuccess, MainPageConstants.ClassError);
  });
}

export function getDragAfterElement(container: HTMLElement, x: number): HTMLElement | undefined {
  const draggableElements = 
    [...container.querySelectorAll(`.word-piece:not(.${MainPageConstants.ClassDragging})`)];

  return draggableElements.reduce<{ offset: number; element: HTMLElement | undefined }>(
    (closest, child) => {
      if (!(child instanceof HTMLElement)) {return closest;}

      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;

      return offset < 0 && offset > closest.offset ? { offset: offset, element: child } : closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: undefined },
  ).element;
}