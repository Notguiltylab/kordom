/**
 * Thin localStorage wrapper standing in for a real backend during this prototype.
 * Every read/write goes through here so a future developer can swap this module
 * for real API calls without touching call sites elsewhere in the app.
 */

const NAMESPACE = 'kordom:';

export function readAll<T>(key: string, fallback: T[]): T[] {
  const raw = localStorage.getItem(NAMESPACE + key);
  if (!raw) {
    writeAll(key, fallback);
    return fallback;
  }
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

export function writeAll<T>(key: string, value: T[]): void {
  localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
}

export function readOne<T>(key: string): T | null {
  const raw = localStorage.getItem(NAMESPACE + key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeOne<T>(key: string, value: T): void {
  localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
}

export function removeOne(key: string): void {
  localStorage.removeItem(NAMESPACE + key);
}

export function resetAllDemoData(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(NAMESPACE))
    .forEach((k) => localStorage.removeItem(k));
}

export function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
