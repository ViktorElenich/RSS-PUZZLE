import { PageIds, StartPageConstants } from '../../core/constants';
import { storageService } from '../../services/storage-service';
import { createElement } from '../../utils/dom';

export class StartView {
  private readonly element: HTMLElement;
  private readonly startButton: HTMLButtonElement;

  constructor() {
    const user = storageService.getUser();
    const userName = user ? `${user.firstName} ${user.surname}` : 'Guest';

    this.startButton = createElement('button', {
      className: 'start-button',
      text: StartPageConstants.ButtonText,
      on: [['click', (): void => { this.handleStartGame(); }]],
    });

    const title = createElement('h1', {
      className: 'start-title',
      text: StartPageConstants.Title,
    });

    const description = createElement('p', {
      className: 'start-description',
      text: StartPageConstants.Description,
    });

    const greeting = createElement('h2', {
      className: 'greeting',
      text: `Hello, ${userName}!`,
    });

    const content = createElement('div', {
      className: 'start-content',
    }, greeting, title, description, this.startButton);

    this.element = createElement('div', {
      className: 'start-page',
      attrs: { id: PageIds.StartPage },
    }, content);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private handleStartGame(): void {
    globalThis.location.hash = PageIds.MainPage;
  }
}