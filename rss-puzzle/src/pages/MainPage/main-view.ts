import { 
  createPuzzleArea, 
  renderWordsToContainer, 
  createSourceArea, 
  highlightActiveRow,
  getCurrentRowWords,
  setValidationStyles,
  clearValidationStyles,
} from './main-ui';
import { fetchLevelData } from '../../api/api';
import { PageIds, MainPageConstants, GameConstants } from '../../core/constants';
import { createElement } from '../../utils/dom';
import { DragManager } from '../../utils/drag-manager';
import { shuffleArray } from '../../utils/shuffle';

import type { LevelCollection, Round, ShuffledWord } from '../../core/types';

export class MainView {
  private readonly element: HTMLElement;
  private readonly puzzleArea: HTMLElement;
  private readonly sourceArea: HTMLElement;
  private readonly translationHint: HTMLElement;
  private readonly playAudioBtn: HTMLButtonElement;
  private readonly hintsWrapper: HTMLElement;
  private levelInfoElement: HTMLElement;
  
  private checkBtn: HTMLButtonElement;
  private giveUpBtn: HTMLButtonElement;
  private continueBtn: HTMLButtonElement;
  private translationToggleBtn: HTMLButtonElement;
  private audioToggleBtn: HTMLButtonElement;

  private levelCollection: LevelCollection | undefined = undefined; 
  private currentRoundData: Round | undefined = undefined;
  private currentAudio: HTMLAudioElement | undefined = undefined;
  private currentLevel = 1; 
  private currentRoundIndex = 0;
  private currentSentenceIndex = 0;

  private isAudioHintEnabled = false;

  private draggingElement: DragManager;

  constructor() {
    this.puzzleArea = createPuzzleArea();
    this.sourceArea = createSourceArea();

    this.draggingElement = new DragManager({
      puzzleArea: this.puzzleArea,
      sourceArea: this.sourceArea,
      getCurrentRow: (): HTMLElement | undefined => {
        const row = this.puzzleArea.children[this.currentSentenceIndex];
        return row instanceof HTMLElement ? row : undefined;
      },
      onUpdate: (): void => {
        this.updateCheckButtonState();
      },
      onValidationClear: (): void => {
        clearValidationStyles(this.puzzleArea, this.currentSentenceIndex);
      },
    });

    this.levelInfoElement = createElement('div', { className: 'level-selectors', text: '' });

    this.translationHint = createElement('div', { 
      className: `${MainPageConstants.HintTranslationClass} ${MainPageConstants.ClassHidden}`, 
    });

    this.puzzleArea.addEventListener('click', this.handleWordClick.bind(this));
    this.sourceArea.addEventListener('click', this.handleWordClick.bind(this));

    this.checkBtn = this.createButton(MainPageConstants.ButtonCheck, 'game-btn-primary');
    this.giveUpBtn = this.createButton(MainPageConstants.ButtonGiveUp, 'game-btn-secondary');
    this.continueBtn = this.createButton(
      MainPageConstants.ButtonContinue, 'game-btn-primary hidden');
    
    this.translationToggleBtn = createElement('button', {
      className: MainPageConstants.HintButtonClass,
      attrs: { type: 'button', title: 'Show translation' },
      on: [['click', this.toggleTranslationHint.bind(this)]],
    });
    this.translationToggleBtn.innerHTML = MainPageConstants.IconShowTranslation;
    this.audioToggleBtn = createElement('button', {
      className: MainPageConstants.HintButtonClass, 
      attrs: { type: 'button', title: 'Enable/Disable audio hint' },
      on: [['click', this.toggleAudioHintState.bind(this)]],
    });
    this.audioToggleBtn.innerHTML = MainPageConstants.IconSpeaker;

    this.playAudioBtn = createElement('button', {
      className: `play-audio-btn ${MainPageConstants.ClassHidden}`,
      attrs: { type: 'button', title: 'Play audio' },
      on: [['click', (): void => { this.playAudio(); }]],
    });
    this.playAudioBtn.innerHTML = MainPageConstants.IconSpeaker;

    this.hintsWrapper = createElement('div', { className: 'sentence-hints-row' }, 
      this.playAudioBtn, 
      this.translationHint,
    );

    this.checkBtn.disabled = true;  

    this.checkBtn.addEventListener('click', this.handleCheck.bind(this));
    this.continueBtn.addEventListener('click', this.handleContinue.bind(this));
    this.giveUpBtn.addEventListener('click', this.handleGiveUp.bind(this));

    const buttonsPanel = createElement('div', { className: 'game-buttons' }, 
      this.giveUpBtn, 
      this.checkBtn,
      this.continueBtn,
    );

    const controlsBar = this.createControlsBar();

    const container = createElement('div', { className: 'game-container' },
      controlsBar,
      this.hintsWrapper,
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
    if (!this.continueBtn.classList.contains(MainPageConstants.ClassHidden)) {
      return;
    }

    clearValidationStyles(this.puzzleArea, this.currentSentenceIndex);

    const target = event.target;
    if (!(target instanceof HTMLElement)) { return; }

    const wordElement = target.closest('.word-piece');
    if (!wordElement || !(wordElement instanceof HTMLElement)) { return; }

    const currentRow = this.puzzleArea.children[this.currentSentenceIndex];

    if (this.sourceArea.contains(wordElement)) {
      currentRow.append(wordElement);
    } else if (currentRow.contains(wordElement)) {
      this.sourceArea.append(wordElement);
    }

    this.updateCheckButtonState();
  }

  private async initGame(): Promise<void> {
    const data = await fetchLevelData(this.currentLevel);

    if (!data) {
      this.sourceArea.textContent = 'Error loading data';
      return;
    }

    this.levelCollection = data;
    this.currentRoundData = this.levelCollection.rounds[this.currentRoundIndex];
    
    this.updateLevelInfo();
    this.renderCurrentSentence();
  }

  private renderCurrentSentence(): void {
    if (!this.currentRoundData) { return; }

    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];
    this.translationHint.textContent = sentenceData.textExampleTranslate;
    this.translationHint.classList.add(MainPageConstants.ClassHidden);
    this.translationToggleBtn.classList.remove(MainPageConstants.HintButtonActive);
    this.translationToggleBtn.innerHTML = MainPageConstants.IconShowTranslation;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = undefined;
      this.playAudioBtn.classList.remove(MainPageConstants.HintButtonActive);
    }

    this.updatePlayBtnVisibility();

    highlightActiveRow(this.puzzleArea, this.currentSentenceIndex);

    const wordObjects = this.generateWordData();
    const shuffled: ShuffledWord[] = shuffleArray<ShuffledWord>(wordObjects);

    renderWordsToContainer(this.sourceArea, shuffled);
    this.updateCheckButtonState();
  }

  private handleCheck(): void {
    if (!this.currentRoundData) { return; }

    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];
    
    const originalText = sentenceData.textExample.split(' ');
    const currentWords = getCurrentRowWords(this.puzzleArea, this.currentSentenceIndex);

    if (currentWords.length !== originalText.length) {
      return; 
    }

    const checkResults = currentWords.map((word, index) => word === originalText[index]);
    setValidationStyles(this.puzzleArea, this.currentSentenceIndex, checkResults);

    const hasError = checkResults.includes(false);

    if (!hasError) {
      this.showContinueButton();
      if (this.translationHint.classList.contains(MainPageConstants.ClassHidden)) {
        this.toggleTranslationHint();
      }
      this.updatePlayBtnVisibility(true);
    } 
  }

  private handleContinue(): void {
    clearValidationStyles(this.puzzleArea, this.currentSentenceIndex);

    this.currentSentenceIndex += 1;

    if (this.currentSentenceIndex < GameConstants.TotalSentences) {
      this.renderCurrentSentence();
      this.resetButtonState();
      return;
    } 

    this.currentRoundIndex += 1;
    this.currentSentenceIndex = 0;

    if (this.levelCollection && this.currentRoundIndex < this.levelCollection.rounds.length) {
      this.currentRoundData = this.levelCollection.rounds[this.currentRoundIndex];
      
      this.rebuildPuzzleRows();
      
      this.updateLevelInfo();
      this.renderCurrentSentence();
      this.resetButtonState();
    } else {
      this.sourceArea.textContent = 'Level Completed! Great job!';
      this.checkBtn.classList.add(MainPageConstants.ClassHidden);
      this.giveUpBtn.classList.add(MainPageConstants.ClassHidden);
      this.continueBtn.classList.add(MainPageConstants.ClassHidden);
      this.translationToggleBtn.classList.add(MainPageConstants.ClassHidden);
      this.audioToggleBtn.classList.add(MainPageConstants.ClassHidden);
      this.playAudioBtn.classList.add(MainPageConstants.ClassHidden);
    }
  }

  private handleGiveUp(): void {
    if (!this.currentRoundData) { return; }
    
    clearValidationStyles(this.puzzleArea, this.currentSentenceIndex);

    const correctWords = this.generateWordData();

    const currentRow = this.puzzleArea.children[this.currentSentenceIndex];
    if (!(currentRow instanceof HTMLElement)) {return;}

    renderWordsToContainer(currentRow, correctWords);

    this.sourceArea.replaceChildren();

    const successResults = correctWords.map(() => true);
    setValidationStyles(this.puzzleArea, this.currentSentenceIndex, successResults);

    this.showContinueButton();
    if (this.translationHint.classList.contains(MainPageConstants.ClassHidden)) {
      this.toggleTranslationHint();
    }
    this.updatePlayBtnVisibility(true);
    this.playAudio();
  }

  private generateWordData(): ShuffledWord[] {
    if (!this.currentRoundData) { return []; }

    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];
    const segments: string[] = sentenceData.textExample.split(' ');
    const totalLettersCount = segments.reduce((accumulator, word) => accumulator + word.length, 0);
    const imageSource = 
      `${MainPageConstants.ImagesBaseUrl}${this.currentRoundData.levelData.imageSrc}`;

    let currentXOffset = 0;
    const pixelsPerPercent = MainPageConstants.PuzzleWidthPx / GameConstants.PercentageBase;

    return segments.map((word, index) => {
      const widthPercent = (word.length / totalLettersCount) * GameConstants.PercentageBase;
      const widthString = `${widthPercent}%`;

      const bgPosY = `-${this.currentSentenceIndex * MainPageConstants.PuzzleRowHeightPx}px`;
      const bgPosX = `-${currentXOffset * pixelsPerPercent}px`;

      currentXOffset += widthPercent;

      return {
        word,
        originalIndex: index,
        isFirst: index === 0,
        isLast: index === segments.length - 1,
        width: widthString,
        backgroundImage: `url(${imageSource})`,
        backgroundPosition: `${bgPosX} ${bgPosY}`,
        backgroundSize: '1000px auto',
      };
    });
  }

  private updateCheckButtonState(): void {
    if (!this.currentRoundData) { return; }
    
    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];
    const expectedLength = sentenceData.textExample.split(' ').length;
    const currentLength = getCurrentRowWords(this.puzzleArea, this.currentSentenceIndex).length;
    this.checkBtn.disabled = currentLength !== expectedLength;
  }

  private updateLevelInfo(): void {
    this.levelInfoElement.textContent = 
      `Level: ${this.currentLevel} | Round: ${this.currentRoundIndex + 1}`;
  }

  private rebuildPuzzleRows(): void {
    this.puzzleArea.replaceChildren();
    for (let index = 0; index < GameConstants.TotalSentences; index += 1) {
      const row = createElement('div', 
        { className: 'puzzle-row', dataset: { row: String(index) } });
      this.puzzleArea.append(row);
    }
  }

  private toggleTranslationHint(): void {
    const isHidden = this.translationHint.classList.contains(MainPageConstants.ClassHidden);
    
    if (isHidden) {
      this.translationHint.classList.remove(MainPageConstants.ClassHidden);
      this.translationToggleBtn.classList.add(MainPageConstants.HintButtonActive);
      this.translationToggleBtn.innerHTML = MainPageConstants.IconHideTranslation;
    } else {
      this.translationHint.classList.add(MainPageConstants.ClassHidden);
      this.translationToggleBtn.classList.remove(MainPageConstants.HintButtonActive);
      this.translationToggleBtn.innerHTML = MainPageConstants.IconShowTranslation;
    }
  }

  private playAudio(): void {
    if (!this.currentRoundData) { return; }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.playAudioBtn.classList.remove(MainPageConstants.HintButtonActive);
    }
    
    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];
    const audioUrl = `${MainPageConstants.AudioBaseUrl}${sentenceData.audioExample}`;

    this.currentAudio = new Audio(audioUrl);
    this.playAudioBtn.classList.add(MainPageConstants.HintButtonActive);

    this.currentAudio.addEventListener('ended', () => {
      this.playAudioBtn.classList.remove(MainPageConstants.HintButtonActive);
      this.currentAudio = undefined;
    });

    this.currentAudio.addEventListener('error', () => {
      this.playAudioBtn.classList.remove(MainPageConstants.HintButtonActive);
      this.currentAudio = undefined;
    });

    void this.currentAudio.play();
  }

  private toggleAudioHintState(): void {
    this.isAudioHintEnabled = !this.isAudioHintEnabled;

    this.audioToggleBtn.classList.toggle(
      MainPageConstants.HintButtonActive,
      this.isAudioHintEnabled,
    );

    this.updatePlayBtnVisibility();
  }

  private updatePlayBtnVisibility(forceShow = false): void {
    if (forceShow) {
      this.playAudioBtn.classList.remove(MainPageConstants.ClassHidden);
      return;
    }

    this.playAudioBtn.classList.toggle(MainPageConstants.ClassHidden, !this.isAudioHintEnabled);
  }

  private showContinueButton(): void {
    this.checkBtn.classList.add(MainPageConstants.ClassHidden);
    this.giveUpBtn.classList.add(MainPageConstants.ClassHidden);
    this.continueBtn.classList.remove(MainPageConstants.ClassHidden);
  }

  private resetButtonState(): void {
    this.checkBtn.classList.remove(MainPageConstants.ClassHidden);
    this.giveUpBtn.classList.remove(MainPageConstants.ClassHidden);
    this.continueBtn.classList.add(MainPageConstants.ClassHidden);
  }

  private createButton(text: string, extraClass: string): HTMLButtonElement {
    return createElement('button', {
      className: `game-btn ${extraClass}`,
      text: text,
      attrs: { type: 'button' },
    });
  }

  private createControlsBar(): HTMLElement {
    const hints = createElement('div', { className: 'hint-buttons' }, 
      this.audioToggleBtn,
      this.translationToggleBtn,
    );

    return createElement('div', { className: 'game-controls-bar' }, this.levelInfoElement, hints);
  }
}