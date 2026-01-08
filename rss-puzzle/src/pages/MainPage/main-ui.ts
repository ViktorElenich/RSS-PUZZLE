import { GameConstants, MainPageConstants } from '../../core/constants';
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

export function renderWordsToContainer(container: HTMLElement, words: ShuffledWord[]): void {
  container.replaceChildren();

  for (const item of words) {
    let cssClass = 'word-piece';

    if (item.isFirst) {
      cssClass += ' puzzle-first';
    }
    if (item.isLast) {
      cssClass += ' puzzle-last';
    }
    const wordElement = createElement('div', {
      className: cssClass,
      text: item.word,
      dataset: { 
        word: item.word,
        index: String(item.originalIndex),
      },
      style: {
        width: item.width, 
      },
    });
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
    
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isCorrect === undefined) { return; }

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