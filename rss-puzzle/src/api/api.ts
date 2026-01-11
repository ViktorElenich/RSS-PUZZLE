import { BASE } from '../core/constants';

import type { LevelCollection } from '../core/types';

export function getWordCollectionUrl(level: number): string {
  return `${BASE}assets/data/wordCollectionLevel${level}.json`;
}

function isLevelCollection(data: unknown): data is LevelCollection {
  if (typeof data !== 'object' || !data) {
    return false;
  }
  return 'rounds' in data;
}

export async function fetchLevelData(level: number): Promise<LevelCollection | undefined> {
  try {
    const url = getWordCollectionUrl(level);
    const response = await fetch(url);

    if (!response.ok) {
      return undefined;
    }
    
    const data: unknown = await response.json();

    if (isLevelCollection(data)) {
      return data;
    }

    return undefined;
  } catch {
    return undefined;
  }
}