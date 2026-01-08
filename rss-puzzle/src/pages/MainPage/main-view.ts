import { 
  createPuzzleArea, 
  renderWordsToContainer, 
  createSourceArea, 
  highlightActiveRow,
} from './main-ui';
import { fetchLevelData } from '../../api/api';
import { PageIds, MainPageConstants, GameConstants } from '../../core/constants';
import { createElement } from '../../utils/dom';
import { shuffleArray } from '../../utils/shuffle';

import type { Round, ShuffledWord } from '../../core/types';

export class MainView {
  private readonly element: HTMLElement;
  private readonly puzzleArea: HTMLElement;
  private readonly sourceArea: HTMLElement;
  
  private checkBtn: HTMLButtonElement;
  private giveUpBtn: HTMLButtonElement;
  private continueBtn: HTMLButtonElement;

  private currentRoundData: Round | undefined = undefined;
  private currentLevel = 1; 
  private currentRoundIndex = 0;
  private currentSentenceIndex = 0;

  constructor() {
    this.puzzleArea = createPuzzleArea();
    this.sourceArea = createSourceArea();

    this.puzzleArea.addEventListener('click', this.handleWordClick.bind(this));
    this.sourceArea.addEventListener('click', this.handleWordClick.bind(this));

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

    void this.initGame();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private handleWordClick(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) { return; }

    const wordElement = target.closest('.word-piece');
    if (!wordElement || !(wordElement instanceof HTMLElement)) { return; }

    const currentRow = this.puzzleArea.querySelector(`[data-row="${this.currentSentenceIndex}"]`);
    if (!currentRow) { return; }

    if (this.sourceArea.contains(wordElement)) {
      currentRow.append(wordElement);
    } else if (currentRow.contains(wordElement)) {
      this.sourceArea.append(wordElement);
    }
  }

  private async initGame(): Promise<void> {
    const levelCollection = await fetchLevelData(this.currentLevel);

    if (!levelCollection) {
      this.sourceArea.textContent = 'Error loading data';
      return;
    }

    const roundData = levelCollection.rounds[this.currentRoundIndex];
    
    this.currentRoundData = roundData;
    this.renderCurrentSentence();
  }

  private renderCurrentSentence(): void {
    if (!this.currentRoundData) { return; }

    const wordsList = this.currentRoundData.words;
    if (this.currentSentenceIndex >= wordsList.length) { return; }

    const sentenceData = wordsList[this.currentSentenceIndex];

    highlightActiveRow(this.puzzleArea, this.currentSentenceIndex);

    const segments: string[] = sentenceData.textExample.split(' ');
    const totalLettersCount = segments.reduce((accumulator, word) => accumulator + word.length, 0);
    
    const wordObjects: ShuffledWord[] = segments.map((word, index) => ({
      word,
      originalIndex: index,
      isFirst: index === 0,
      isLast: index === segments.length - 1,
      width: `${(word.length / totalLettersCount) * GameConstants.PercentageBase}%`,
    }));

    const shuffled: ShuffledWord[] = shuffleArray<ShuffledWord>(wordObjects);
    renderWordsToContainer(this.sourceArea, shuffled);
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