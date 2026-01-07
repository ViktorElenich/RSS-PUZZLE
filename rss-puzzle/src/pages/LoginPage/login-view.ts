import { LoginConstants, PageIds, ValidationConstants } from '../../core/constants';
import { createElement } from '../../utils/dom';
import { validateName } from '../../utils/validation';

export class LoginView {
  private readonly element: HTMLElement;
  private readonly firstNameInput: HTMLInputElement;
  private readonly surnameInput: HTMLInputElement;
  private readonly firstNameError: HTMLElement;
  private readonly surnameError: HTMLElement;
  private readonly loginButton: HTMLButtonElement;

  private isFirstNameValid = false;
  private isSurnameValid = false;

  constructor() {
    this.firstNameError = createElement('div', { className: 'input-error' });
    this.surnameError = createElement('div', { className: 'input-error' });

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
        disabled: true,
      },
    });

    this.firstNameInput.addEventListener('input', () => {
      this.handleInput(
        this.firstNameInput, 
        this.firstNameError, 
        ValidationConstants.MinFirstNameLength, 
        'First Name',
      );
    });

    this.surnameInput.addEventListener('input', () => {
      this.handleInput(
        this.surnameInput, 
        this.surnameError, 
        ValidationConstants.MinSurnameLength, 
        'Surname',
      );
    });

    const form = createElement('form', {
      className: 'login-form',
      on: [['submit', (event): void => { this.handleSubmit(event); }]],
    },
    createElement('h2', { className: 'login-title', text: LoginConstants.FormTitle }),
    createElement('p', { className: 'login-description', text: LoginConstants.Description }),
      
    this.createInputGroup(
      LoginConstants.FirstNameLabelText, this.firstNameInput, this.firstNameError),
    this.createInputGroup(LoginConstants.SurnameLabelText, this.surnameInput, this.surnameError),
      
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
        autocomplete: 'off',
      },
    });
  }

  private createInputGroup(
    labelText: string, 
    inputElement: HTMLInputElement, 
    errorElement: HTMLElement,
  ): HTMLElement {
    const label = createElement('label', {
      className: 'input-label',
      text: labelText,
      attrs: { for: inputElement.id },
    });

    return createElement('div', { className: 'input-group' }, label, inputElement, errorElement);
  }

  private handleInput(
    input: HTMLInputElement,
    errorElement: HTMLElement,
    minLength: number,
    fieldName: string,
  ): void {
    const result = validateName(input.value, minLength, fieldName);

    if (result.isValid) {
      errorElement.textContent = '';
      input.classList.remove('invalid');
      
      if (input === this.firstNameInput) {
        this.isFirstNameValid = true;
      } else {
        this.isSurnameValid = true;
      }
    } else {
      errorElement.textContent = result.error ?? 'Invalid value';
      input.classList.add('invalid');

      if (input === this.firstNameInput) {
        this.isFirstNameValid = false;
      } else {
        this.isSurnameValid = false;
      }
    }

    this.updateButtonState();
  }

  private updateButtonState(): void {
    if (this.isFirstNameValid && this.isSurnameValid) {
      this.loginButton.removeAttribute('disabled');
    } else {
      this.loginButton.setAttribute('disabled', 'true');
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.isFirstNameValid && this.isSurnameValid) {
      console.log('Login success!', this.firstNameInput.value, this.surnameInput.value);
    }
  }
}