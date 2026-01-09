import type { AppSettings } from '../core/types';

function isAppSettings(data: unknown): data is AppSettings {
  return typeof data === 'object' && data !== null;
}

export class GameSettings {
  private static readonly STORAGE_KEY = 'rss-puzzle-settings-v1';

  public isAudioEnabled = true;
  public isTranslationEnabled = true;
  public isPictureEnabled = true;

  constructor() {
    this.load();
  }

  public load(): void {
    const rawData = localStorage.getItem(GameSettings.STORAGE_KEY);
    if (rawData) {
      try {
        const parsedData: unknown = JSON.parse(rawData);

        if (isAppSettings(parsedData)) {
          this.isAudioEnabled = parsedData.audio ?? true;
          this.isTranslationEnabled = parsedData.translation ?? true;
          this.isPictureEnabled = parsedData.picture ?? true;
        } else {
          this.setDefault();
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
        this.setDefault();
      }
    } else {
      this.setDefault();
    }
  }

  public save(): void {
    const data: AppSettings = {
      audio: this.isAudioEnabled,
      translation: this.isTranslationEnabled,
      picture: this.isPictureEnabled,
    };
    localStorage.setItem(GameSettings.STORAGE_KEY, JSON.stringify(data));
  }

  public static clear(): void {
    localStorage.removeItem(GameSettings.STORAGE_KEY);
  }

  private setDefault(): void {
    this.isAudioEnabled = true;
    this.isTranslationEnabled = true;
    this.isPictureEnabled = true;
  }
}