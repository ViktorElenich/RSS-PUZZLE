import { PageIds } from '../../core/constants';
import { createElement } from '../../utils/dom';

export class MainView {
  private readonly element: HTMLElement;

  constructor() {
    this.element = createElement('div', {
      className: 'main-page',
      attrs: { id: PageIds.MainPage },
      text: 'Game Field will be here',
      style: {
        fontSize: '2rem',
      },
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}