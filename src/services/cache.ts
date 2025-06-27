
// Simple in-memory cache service
class CacheService {
  private cache = new Map<string, { data: any; expiry: number }>();

  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    const expiry = Date.now() + (ttlMinutes * 60 * 1000);
    this.cache.set(key, { data, expiry });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const cache = new CacheService();
