// src/app/app.ts
import { LoginView } from '../pages/LoginPage/login-view';

export class App {
  public start(): void {
    const loginView = new LoginView();
    document.body.append(loginView.getElement());
  }
}
