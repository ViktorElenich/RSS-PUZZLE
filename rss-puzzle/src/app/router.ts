import { HeaderView } from '../components/header/header';
import { PageIds } from '../core/constants';
import { LoginView } from '../pages/LoginPage/login-view';
import { MainView } from '../pages/MainPage/main-view';
import { StartView } from '../pages/StartPage/start-view';
import { StatisticsView } from '../pages/StatisticsPage/statistics-view';
import { storageService } from '../services/storage-service';

export class Router {
  public enable(): void {
    globalThis.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
    this.handleHashChange();
  }

  private handleHashChange(): void {
    const hash = globalThis.location.hash.slice(1);
    const user = storageService.getUser();

    if (!user) {
      if (hash !== PageIds.LoginPage) {
        this.navigateTo(PageIds.LoginPage);
        return;
      }
      this.renderPage(PageIds.LoginPage);
      return;
    }

    if (hash === PageIds.LoginPage || hash === '') {
      this.navigateTo(PageIds.StartPage);
      return;
    }

    this.renderPage(hash);
  }

  private navigateTo(pageId: string): void {
    globalThis.location.hash = pageId;
  }

  private renderPage(pageId: string): void {
    document.body.innerHTML = '';
    const rootElement = document.body;

    if (pageId !== PageIds.LoginPage) {
      const header = new HeaderView();
      rootElement.append(header.getElement());
    }

    let pageElement: HTMLElement | undefined;

    switch (pageId) {
      case PageIds.LoginPage: {
        const view = new LoginView();
        pageElement = view.getElement();
        break;
      }
      case PageIds.StartPage: {
        const view = new StartView();
        pageElement = view.getElement();
        break;
      }
      case PageIds.MainPage: {
        const view = new MainView();
        pageElement = view.getElement();
        break;
      }
      case PageIds.StatisticsPage: {
        const view = new StatisticsView();
        pageElement = view.getElement();
        break;
      }
      default: {
        this.navigateTo(PageIds.StartPage);
      }
    }

    if (pageElement) {
      document.body.append(pageElement);
    }
  }
}