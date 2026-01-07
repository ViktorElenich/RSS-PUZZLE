import { HeaderConstants, PageIds } from '../../core/constants';
import { storageService } from '../../services/storage-service';
import { createElement } from '../../utils/dom';

export class HeaderView {
  private readonly element: HTMLElement;

  constructor() {
    const logoutButton = createElement('button', {
      className: 'logout-button',
      text: HeaderConstants.ButtonText,
      on: [['click', (): void => { this.handleLogout(); }]],
    });

    this.element = createElement('header', {
      className: 'header',
    }, logoutButton);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private handleLogout(): void {
    storageService.clearUser();
    globalThis.location.hash = PageIds.LoginPage;
  }
}