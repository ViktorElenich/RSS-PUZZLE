import { USER_DATA_KEY } from '../core/constants';

import type { UserData } from '../core/types';

function isUserData(data: unknown): data is UserData {
  if (typeof data !== 'object' || !data) {
    return false;
  }
  return 'firstName' in data && 'surname' in data;
}

export const storageService = {
  saveUser(user: UserData): void {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  },

  getUser(): UserData | undefined {
    const data = localStorage.getItem(USER_DATA_KEY);

    if (!data) {
      return undefined;
    }

    try {
      const parsed: unknown = JSON.parse(data);

      if (isUserData(parsed)) {
        return parsed;
      }
      
      return undefined;
    } catch {
      return undefined;
    }
  },

  clearUser(): void {
    localStorage.removeItem(USER_DATA_KEY);
  },
};