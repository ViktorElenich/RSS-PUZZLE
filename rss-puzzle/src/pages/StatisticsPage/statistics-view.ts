import { MainPageConstants, PageIds } from '../../core/constants';
import { createElement } from '../../utils/dom';

import type { RoundStats, WordData } from '../../core/types';


export class StatisticsView {
  private readonly element: HTMLElement;
  private currentAudio: HTMLAudioElement | undefined = undefined;

  constructor() {
    this.element = createElement('div', 
      { className: 'statistics-page', attrs: { id: PageIds.StatisticsPage } });
    this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private render(): void {
    const rawData = localStorage.getItem('rss-puzzle-stats');
    if (!rawData) {
      this.element.textContent = 'No statistics available.';
      return;
    }

    const data: RoundStats = JSON.parse(rawData);
    const title = createElement('h2', { className: 'stats-title', text: 'Round Statistics' });
    const artworkBlock = this.createArtworkBlock(data.artwork);
    const unknownBlock = this.createWordsList('I don\'t know', data.unknown, 'stats-unknown');
    const knownBlock = this.createWordsList('I know', data.known, 'stats-known');

    const continueButton = createElement('button', { 
      className: 'game-btn game-btn-primary', 
      text: 'Continue',
      on: [['click', (): void => { globalThis.location.hash = PageIds.MainPage; }]],
    });
    
    const buttonContainer = createElement('div', { className: 'stats-buttons' }, continueButton);

    const container = createElement('div', { className: 'stats-container' },
      title,
      artworkBlock,
      unknownBlock,
      knownBlock,
      buttonContainer,
    );

    this.element.append(container);
  }

  private createArtworkBlock(artwork: RoundStats['artwork']): HTMLElement {
    const container = createElement('div', { className: 'stats-artwork' });
    const imgUrl = `${MainPageConstants.ImagesBaseUrl}${artwork.imageSrc}`;
    const img = createElement('img', { 
      className: 'stats-artwork-img', 
      attrs: { src: imgUrl, alt: artwork.name },
    });

    const info = createElement('div', { className: 'stats-artwork-info' });
    info.innerHTML = `
      <div class="stats-artwork-title">${artwork.name}</div>
      <div class="stats-artwork-author">${artwork.author}, ${artwork.year}</div>
    `;

    container.append(img, info);
    return container;
  }

  private createWordsList(title: string, words: WordData[], className: string): HTMLElement {
    const container = createElement('div', { className: `stats-list-block ${className}` });
    
    const header = createElement('h3', { className: 'stats-list-header' });
    header.innerHTML = `${title} <span class="stats-count">${words.length}</span>`;

    const list = createElement('ul', { className: 'stats-list' });

    if (words.length === 0) {
      list.textContent = 'None';
    } else {
      words.forEach((word) => {
        const li = createElement('li', { className: 'stats-item' });

        const audioButton = createElement('button', { 
          className: 'stats-audio-btn',
          on: [['click', (): void => { this.playAudio(word.audioExample); }]],
        });
        audioButton.innerHTML = MainPageConstants.IconSpeaker;

        const text = createElement('span', { className: 'stats-text', text: word.textExample });

        li.append(audioButton, text);
        list.append(li);
      });
    }

    container.append(header, list);
    return container;
  }

  private playAudio(path: string): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    const url = `${MainPageConstants.AudioBaseUrl}${path}`;
    this.currentAudio = new Audio(url);
    void this.currentAudio.play();
  }
}