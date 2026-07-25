export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently in demo app
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function scopedKey(base: string, userId: string): string {
  return `${base}:${userId}`;
}
