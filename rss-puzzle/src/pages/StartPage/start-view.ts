import { PageIds, StartPageConstants } from '../../core/constants';
import { createElement } from '../../utils/dom';

export class StartView {
  private readonly element: HTMLElement;
  private readonly startButton: HTMLButtonElement;

  constructor() {
    this.startButton = createElement('button', {
      className: 'start-button',
      text: StartPageConstants.ButtonText,
    });

    const title = createElement('h1', {
      className: 'start-title',
      text: StartPageConstants.Title,
    });

    const description = createElement('p', {
      className: 'start-description',
      text: StartPageConstants.Description,
    });

    const content = createElement('div', {
      className: 'start-content',
    }, title, description, this.startButton);

    this.element = createElement('div', {
      className: 'start-page',
      attrs: { id: PageIds.StartPage },
    }, content);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}