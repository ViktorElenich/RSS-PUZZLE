// src/pages/LoginPage/login-view.ts
import { LoginConstants, PageIds } from '../../core/constants';
import { createElement } from '../../utils/dom';

export class LoginView {
  private readonly element: HTMLElement;
  private readonly firstNameInput: HTMLInputElement;
  private readonly surnameInput: HTMLInputElement;
  private readonly loginButton: HTMLButtonElement;

  constructor() {
    this.firstNameInput = this.createInput(
      LoginConstants.FirstNameInputId, 
      LoginConstants.FirstNameLabelText,
    );
    
    this.surnameInput = this.createInput(
      LoginConstants.SurnameInputId, 
      LoginConstants.SurnameLabelText,
    );

    this.loginButton = createElement('button', {
      className: 'login-button',
      text: LoginConstants.ButtonText,
      attrs: {
        type: 'submit',
      },
    });

    const form = createElement('form', {
      className: 'login-form',
      on: [['submit', (event): void => { this.handleSubmit(event); }]],
    },
    createElement('h2', { className: 'login-title', text: LoginConstants.FormTitle }),
    createElement('p', { className: 'login-description', text: LoginConstants.Description }),
    this.createInputGroup(LoginConstants.FirstNameLabelText, this.firstNameInput),
    this.createInputGroup(LoginConstants.SurnameLabelText, this.surnameInput),
    this.loginButton,
    );

    this.element = createElement('div', {
      className: 'login-page',
      attrs: { id: PageIds.LoginPage },
    }, form);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private createInput(id: string, placeholder: string): HTMLInputElement {
    return createElement('input', {
      className: 'login-input',
      attrs: {
        id,
        type: 'text',
        placeholder,
        required: true,
        name: id,
      },
    });
  }

  private createInputGroup(labelText: string, inputElement: HTMLInputElement): HTMLElement {
    const label = createElement('label', {
      className: 'input-label',
      text: labelText,
      attrs: { for: inputElement.id },
    });

    return createElement('div', { className: 'input-group' }, label, inputElement);
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
  }
}