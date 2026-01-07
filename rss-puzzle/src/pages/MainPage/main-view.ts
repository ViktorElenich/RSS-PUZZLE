import { PageIds, MainPageConstants, GameConstants } from '../../core/constants';
import { createElement } from '../../utils/dom';

export class MainView {
  private readonly element: HTMLElement;
  private readonly puzzleArea: HTMLElement;
  private readonly sourceArea: HTMLElement;
  
  private checkBtn: HTMLButtonElement;
  private giveUpBtn: HTMLButtonElement;
  private continueBtn: HTMLButtonElement;

  constructor() {
    this.puzzleArea = this.createPuzzleArea();
    this.sourceArea = createElement('div', { 
      className: 'source-area', 
      attrs: { id: MainPageConstants.SourceAreaId },
      text: 'Words will appear here',
    });

    this.checkBtn = this.createButton(MainPageConstants.ButtonCheck, 'game-btn-primary');
    this.giveUpBtn = this.createButton(MainPageConstants.ButtonGiveUp, 'game-btn-secondary');
    this.continueBtn = this.createButton(
      MainPageConstants.ButtonContinue, 'game-btn-primary hidden');

    const buttonsPanel = createElement('div', { className: 'game-buttons' }, 
      this.giveUpBtn, 
      this.checkBtn,
      this.continueBtn,
    );

    const controlsBar = this.createControlsBar();

    const container = createElement('div', { className: 'game-container' },
      controlsBar,
      this.puzzleArea,
      this.sourceArea,
      buttonsPanel,
    );

    this.element = createElement('div', {
      className: 'main-page',
      attrs: { id: PageIds.MainPage },
    }, container);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private createPuzzleArea(): HTMLElement {
    const area = createElement('div', { 
      className: 'puzzle-area',
      attrs: { id: MainPageConstants.PuzzleAreaId },
    });

    for (let index = 0; index < GameConstants.TotalSentences; index += 1) {
      const row = createElement('div', { 
        className: 'puzzle-row',
        dataset: { row: index }, 
      });
      area.append(row);
    }

    return area;
  }

  private createButton(text: string, extraClass: string): HTMLButtonElement {
    return createElement('button', {
      className: `game-btn ${extraClass}`,
      text: text,
      attrs: { type: 'button' },
    });
  }

  private createControlsBar(): HTMLElement {
    const levelSelect = createElement('div', 
      { className: 'level-selectors', text: 'Level: 1 | Round: 1' });
    const hints = createElement('div', { className: 'hint-buttons', text: 'Hints: 🎵 🔤' });

    return createElement('div', { className: 'game-controls-bar' }, levelSelect, hints);
  }
}