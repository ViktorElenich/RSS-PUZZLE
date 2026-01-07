import { Router } from './router';

export class App {
  private readonly router: Router;

  constructor() {
    this.router = new Router();
  }

  public start(): void {
    this.router.enable();
  }
}
