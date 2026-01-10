import type { ProgressData } from '../core/types';


function isProgressData(data: unknown): data is ProgressData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'completedLevels' in data &&
    'completedRounds' in data
  );
}

export class GameProgress {
  private static readonly STORAGE_KEY = 'rss-puzzle-progress-v1';

  private data: ProgressData = {
    completedLevels: [],
    completedRounds: {},
  };

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(GameProgress.STORAGE_KEY);
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (isProgressData(parsed)) {
          this.data = parsed;
        }
      } catch (error) {
        console.error('Failed to parse progress', error);
      }
    }
  }

  private save(): void {
    localStorage.setItem(GameProgress.STORAGE_KEY, JSON.stringify(this.data));
  }

  public markRoundCompleted(level: number, roundIndex: number): void {
    const levelKey = String(level);
    let rounds = this.data.completedRounds[levelKey];

    if (!rounds) {
      rounds = [];
      this.data.completedRounds[levelKey] = rounds;
    }

    if (!rounds.includes(roundIndex)) {
      rounds.push(roundIndex);
      this.save();
    }
  }

  public isRoundCompleted(level: number, roundIndex: number): boolean {
    const levelKey = String(level);
    const rounds = this.data.completedRounds[levelKey];

    if (!rounds) {
      return false;
    }

    return rounds.includes(roundIndex);
  }

  public markLevelCompleted(level: number): void {
    if (!this.data.completedLevels.includes(level)) {
      this.data.completedLevels.push(level);
      this.save();
    }
  }

  public isLevelCompleted(level: number): boolean {
    return this.data.completedLevels.includes(level);
  }
}