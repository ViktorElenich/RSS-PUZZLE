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
import { GameProgress } from '../../services/game-progress.service';
import { GameSettings } from '../../services/game-settings.service';
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
  private readonly artworkInfoElement: HTMLElement;
  
  private selectorsContainer: HTMLElement;
  private levelSelect: HTMLSelectElement;
  private roundSelect: HTMLSelectElement;
  
  private checkBtn: HTMLButtonElement;
  private giveUpBtn: HTMLButtonElement;
  private continueBtn: HTMLButtonElement;

  private translationToggleBtn: HTMLButtonElement;
  private audioToggleBtn: HTMLButtonElement;
  private pictureToggleBtn: HTMLButtonElement;

  private levelCollection: LevelCollection | undefined = undefined; 
  private currentRoundData: Round | undefined = undefined;
  private currentAudio: HTMLAudioElement | undefined = undefined;
  private currentBackgroundImage: HTMLImageElement | undefined = undefined;

  private currentLevel = 1; 
  private currentRoundIndex = 0;
  private currentSentenceIndex = 0;

  private settings = new GameSettings();
  private progress = new GameProgress();

  private draggingElement: DragManager;

  constructor() {
    const lastPos = this.progress.getLastPosition();
    if (lastPos) {
      this.currentLevel = lastPos.level;
      this.currentRoundIndex = lastPos.round;
    }

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

    this.levelSelect = createElement('select', { 
      className: 'game-select',
      on: [['change', this.handleLevelChange.bind(this)]],
    });
    this.initLevelSelector();

    this.roundSelect = createElement('select', { 
      className: 'game-select',
      on: [['change', this.handleRoundChange.bind(this)]],
    });

    const levelGroup = createElement('div', { className: 'selector-group' },
      createElement('span', { className: 'selector-label', text: 'Level:' }),
      this.levelSelect,
    );
    const roundGroup = createElement('div', { className: 'selector-group' },
      createElement('span', { className: 'selector-label', text: 'Round:' }),
      this.roundSelect,
    );

    this.selectorsContainer = createElement('div', { className: 'level-selectors' }, 
      levelGroup, 
      roundGroup,
    );

    this.translationHint = createElement('div', { 
      className: `${MainPageConstants.HintTranslationClass} ${MainPageConstants.ClassHidden}`, 
    });

    this.artworkInfoElement = createElement('div', { 
      className: `artwork-info ${MainPageConstants.ClassHidden}`,
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

    this.pictureToggleBtn = createElement('button', {
      className: MainPageConstants.HintButtonClass,
      attrs: { type: 'button', title: 'Show/Hide background picture' },
      on: [['click', this.togglePictureHint.bind(this)]],
    });
    this.pictureToggleBtn.innerHTML = MainPageConstants.IconPicture;
    if (this.settings.isPictureEnabled) {
      this.pictureToggleBtn.classList.add(MainPageConstants.HintButtonActive);
    }

    this.playAudioBtn = createElement('button', {
      className: 'play-audio-btn',
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
      this.artworkInfoElement,
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
    this.levelSelect.disabled = true;
    this.roundSelect.disabled = true;
    this.hideRoundResult(); 

    this.initLevelSelector();

    const data = await fetchLevelData(this.currentLevel);

    if (!data) {
      this.sourceArea.textContent = 'Error loading data';
      this.levelSelect.disabled = false;
      return;
    }

    this.levelCollection = data;
    this.updateRoundSelector();
    this.currentRoundData = this.levelCollection.rounds[this.currentRoundIndex];

    await this.loadRoundImage();
    
    this.renderCurrentSentence();

    this.levelSelect.disabled = false;
    this.roundSelect.disabled = false;
  }

  private renderCurrentSentence(): void {
    if (!this.currentRoundData || !this.currentBackgroundImage) { return; }

    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];

    if (this.settings.isTranslationEnabled) {
      this.translationHint.classList.remove(MainPageConstants.ClassHidden);
      this.translationToggleBtn.classList.add(MainPageConstants.HintButtonActive);
      this.translationToggleBtn.innerHTML = MainPageConstants.IconHideTranslation;
    } else {
      this.translationHint.classList.add(MainPageConstants.ClassHidden);
      this.translationToggleBtn.classList.remove(MainPageConstants.HintButtonActive);
      this.translationToggleBtn.innerHTML = MainPageConstants.IconShowTranslation;
    }

    this.translationHint.textContent = sentenceData.textExampleTranslate;

    this.audioToggleBtn.classList.toggle(
      MainPageConstants.HintButtonActive, 
      this.settings.isAudioEnabled,
    );

    this.pictureToggleBtn.classList.toggle(
      MainPageConstants.HintButtonActive, 
      this.settings.isPictureEnabled,
    );

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = undefined;
      this.playAudioBtn.classList.remove(MainPageConstants.HintButtonActive);
    }

    this.updatePlayBtnVisibility();

    highlightActiveRow(this.puzzleArea, this.currentSentenceIndex);

    const wordObjects = this.generateWordData();
    const shuffled: ShuffledWord[] = shuffleArray<ShuffledWord>(wordObjects);


    const bgImageToRender = 
      this.settings.isPictureEnabled ? this.currentBackgroundImage : undefined;

    renderWordsToContainer(this.sourceArea, shuffled, bgImageToRender);
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
      if (!this.settings.isPictureEnabled && this.currentBackgroundImage) {
        const currentRow = this.puzzleArea.children[this.currentSentenceIndex];
        if (currentRow instanceof HTMLElement) {
          const correctWords = this.generateWordData(); 
          renderWordsToContainer(currentRow, correctWords, this.currentBackgroundImage);
          const successResults = correctWords.map(() => true);
          setValidationStyles(this.puzzleArea, this.currentSentenceIndex, successResults);
        }
      }
      this.translationHint.classList.remove(MainPageConstants.ClassHidden);
      this.updatePlayBtnVisibility(true);

      if (this.currentSentenceIndex === GameConstants.TotalSentences - 1) {
        this.showRoundResult();
      }
    } 
  }

  private async handleContinue(): Promise<void> {
    clearValidationStyles(this.puzzleArea, this.currentSentenceIndex);

    this.currentSentenceIndex += 1;

    if (this.currentSentenceIndex < GameConstants.TotalSentences) {
      this.renderCurrentSentence();
      this.resetButtonState();
      return;
    } 

    this.hideRoundResult();
    this.progress.markRoundCompleted(this.currentLevel, this.currentRoundIndex);

    let nextRoundIndex = this.currentRoundIndex + 1;
    let nextLevel = this.currentLevel;

    if (this.levelCollection && nextRoundIndex >= this.levelCollection.rounds.length) {
      nextRoundIndex = 0;
      nextLevel += 1;
      
      if (nextLevel > GameConstants.TotalLevels) {
        nextLevel = 1;
      }
      
      this.progress.markLevelCompleted(this.currentLevel);
      this.initLevelSelector(); 
    }

    this.progress.saveLastPosition(nextLevel, nextRoundIndex);

    if (nextLevel === this.currentLevel) {
      this.currentRoundIndex = nextRoundIndex;
      this.currentSentenceIndex = 0;
      
      this.updateRoundSelector();
      this.roundSelect.value = String(this.currentRoundIndex);

      if (this.levelCollection) {
        this.currentRoundData = this.levelCollection.rounds[this.currentRoundIndex];
        await this.loadRoundImage();
        this.rebuildPuzzleRows();
        this.renderCurrentSentence();
        this.resetButtonState();
      }
    } else {
      this.currentLevel = nextLevel;
      this.currentRoundIndex = nextRoundIndex;
      this.currentSentenceIndex = 0;

      this.levelSelect.value = String(this.currentLevel);
      
      await this.initGame();
      this.resetButtonState();
    }
  }

  private handleGiveUp(): void {
    if (!this.currentRoundData || !this.currentBackgroundImage) { return; }
    
    clearValidationStyles(this.puzzleArea, this.currentSentenceIndex);

    const correctWords = this.generateWordData();

    const currentRow = this.puzzleArea.children[this.currentSentenceIndex];
    if (!(currentRow instanceof HTMLElement)) {return;}

    renderWordsToContainer(currentRow, correctWords, this.currentBackgroundImage);

    this.sourceArea.replaceChildren();

    const successResults = correctWords.map(() => true);
    setValidationStyles(this.puzzleArea, this.currentSentenceIndex, successResults);

    this.showContinueButton();
    this.translationHint.classList.remove(MainPageConstants.ClassHidden);

    this.updatePlayBtnVisibility(true);
    this.playAudio();

    if (this.currentSentenceIndex === GameConstants.TotalSentences - 1) {
      this.showRoundResult();
    }
  }

  private generateWordData(): ShuffledWord[] {
    if (!this.currentRoundData) { return []; }

    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];
    const segments: string[] = sentenceData.textExample.split(' ');
    const totalLettersCount = segments.reduce((accumulator, word) => accumulator + word.length, 0);

    const baseWidth = 1000; 
    const pixelsPerPercent = baseWidth / GameConstants.PercentageBase;

    let currentXOffset = 0;

    return segments.map((word, index) => {
      const widthPercent = (word.length / totalLettersCount) * GameConstants.PercentageBase;
      const widthString = `${widthPercent}%`;
      const widthPx = widthPercent * pixelsPerPercent;

      const bgPosY = this.currentSentenceIndex * MainPageConstants.PuzzleRowHeightPx;
      const bgPosX = currentXOffset * pixelsPerPercent;

      const wordData: ShuffledWord = {
        word,
        originalIndex: index,
        isFirst: index === 0,
        isLast: index === segments.length - 1,
        width: widthString,
        drawWidth: widthPx,
        bgX: bgPosX,
        bgY: bgPosY,
      };

      currentXOffset += widthPercent;
      return wordData;
    });
  }

  private updateCheckButtonState(): void {
    if (!this.currentRoundData) { return; }
    
    const sentenceData = this.currentRoundData.words[this.currentSentenceIndex];
    const expectedLength = sentenceData.textExample.split(' ').length;
    const currentLength = getCurrentRowWords(this.puzzleArea, this.currentSentenceIndex).length;
    this.checkBtn.disabled = currentLength !== expectedLength;
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
    this.settings.isTranslationEnabled = !this.settings.isTranslationEnabled;
    this.settings.save();
    
    if (this.settings.isTranslationEnabled) {
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
    this.settings.isAudioEnabled = !this.settings.isAudioEnabled;
    this.settings.save();

    this.audioToggleBtn.classList.toggle(
      MainPageConstants.HintButtonActive, 
      this.settings.isAudioEnabled,
    );

    this.updatePlayBtnVisibility();
  }

  private updatePlayBtnVisibility(forceShow = false): void {
    if (this.settings.isAudioEnabled || forceShow) {
      this.playAudio();
    }
  }

  private async loadRoundImage(): Promise<void> {
    if (!this.currentRoundData) { return; }
    
    const imageUrl = 
      `${MainPageConstants.ImagesBaseUrl}${this.currentRoundData.levelData.imageSrc}`;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageUrl;
      img.addEventListener('load', (): void => {
        this.currentBackgroundImage = img;
        resolve();
      });
      img.addEventListener('error', (): void => {
        this.currentBackgroundImage = undefined; 
        resolve();
      });
    });
  }

  private togglePictureHint(): void {
    this.settings.isPictureEnabled = !this.settings.isPictureEnabled;
    this.settings.save();

    this.pictureToggleBtn.classList.toggle(
      MainPageConstants.HintButtonActive, 
      this.settings.isPictureEnabled,
    );

    if (this.currentRoundData) {
      this.renderCurrentSentence();
    }
  }

  private initLevelSelector(): void {
    this.levelSelect.innerHTML = '';
    
    for (let index = 1; index <= GameConstants.TotalLevels; index += 1) {
      const isCompleted = this.progress.isLevelCompleted(index);
      
      const text = isCompleted ? `${index} ★` : String(index);
      
      const option = createElement('option', { 
        text: text, 
        attrs: { value: String(index) },
      });

      if (isCompleted) {
        option.classList.add('completed-option');
      }
      
      this.levelSelect.append(option);
    }
    this.levelSelect.value = String(this.currentLevel);
  }

  private updateRoundSelector(): void {
    if (!this.levelCollection) { return; }
    
    this.roundSelect.innerHTML = '';
    const roundsCount = this.levelCollection.rounds.length;

    for (let index = 0; index < roundsCount; index += 1) {
      const roundNumber = index + 1;
      const isCompleted = this.progress.isRoundCompleted(this.currentLevel, index);
      
      const text = isCompleted ? `${roundNumber} ✓` : String(roundNumber);
      
      const option = createElement('option', { 
        text: text, 
        attrs: { value: String(index) },
      });
      
      if (isCompleted) {
        option.classList.add('completed-option');
      }
      
      this.roundSelect.append(option);
    }
    
    this.roundSelect.value = String(this.currentRoundIndex);
  }

  private async handleLevelChange(): Promise<void> {
    const newLevel = Number(this.levelSelect.value);
    this.currentLevel = newLevel;
    this.currentRoundIndex = 0;

    this.progress.saveLastPosition(this.currentLevel, this.currentRoundIndex);
    
    await this.initGame();
  }

  private async handleRoundChange(): Promise<void> {
    const newRoundIndex = Number(this.roundSelect.value);
    this.currentRoundIndex = newRoundIndex;
    this.currentSentenceIndex = 0;

    this.progress.saveLastPosition(this.currentLevel, this.currentRoundIndex);

    this.resetButtonState();
    this.rebuildPuzzleRows();
    this.hideRoundResult();

    if (this.levelCollection) {
      this.currentRoundData = this.levelCollection.rounds[this.currentRoundIndex];
      await this.loadRoundImage();
      this.renderCurrentSentence();
    }
  }

  private showRoundResult(): void {
    if (!this.currentRoundData) { return; }

    const { imageSrc, author, name, year } = this.currentRoundData.levelData;
    const fullImageUrl = `${MainPageConstants.ImagesBaseUrl}${imageSrc}`;

    this.puzzleArea.style.backgroundImage = `url(${fullImageUrl})`;
    this.puzzleArea.style.backgroundSize = 'cover'; 
    this.puzzleArea.style.backgroundPosition = 'center';
    this.puzzleArea.style.backgroundRepeat = 'no-repeat';

    this.puzzleArea.classList.add('completed');

    this.artworkInfoElement.innerHTML = `
      <span class="artwork-title">${name}</span>
      <span>${author}, ${year}</span>
    `;
    this.artworkInfoElement.classList.remove(MainPageConstants.ClassHidden);
  }

  private hideRoundResult(): void {
    this.puzzleArea.classList.remove('completed');
    this.puzzleArea.style.backgroundImage = '';
    this.artworkInfoElement.classList.add(MainPageConstants.ClassHidden);
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
      this.pictureToggleBtn,
    );

    return createElement('div', { className: 'game-controls-bar' }, this.selectorsContainer, hints);
  }
}