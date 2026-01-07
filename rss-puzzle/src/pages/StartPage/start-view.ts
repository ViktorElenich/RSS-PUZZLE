import { PageIds } from '../../core/constants';
import { createElement } from '../../utils/dom';

export class StartView {
  private readonly element: HTMLElement;

  constructor() {
    this.element = createElement('div', {
      className: 'start-page',
      attrs: { id: PageIds.StartPage },
      text: 'Welcome to Start Page',
      style: {
        padding: '20px',
        textAlign: 'center',
        fontSize: '24px',
        color: '#fff',
      },
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}