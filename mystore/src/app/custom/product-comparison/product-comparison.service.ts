import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'compare';
export const COMPARISON_MAX = 4;

// Phase 5, Step 3: the comparison list. Small, per-user state, so signals are enough.
@Injectable({ providedIn: 'root' }) // one list for the whole app
export class ProductComparisonService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID)); // are we in the browser?

  readonly codes = signal<string[]>(this.load()); // codes of the chosen products
  readonly count = computed(() => this.codes().length); // how many
  readonly isFull = computed(() => this.count() >= COMPARISON_MAX); // the max rule
  readonly lastAdded = signal<string | null>(null); // stretch goal

  constructor() {
    // on every list change, save it in the browser (never on the server)
    effect(() => {
      const codes = this.codes();
      if (this.isBrowser) localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    });
  }

  has(code: string): boolean {
    return this.codes().includes(code);
  }

  toggle(code: string): void {
    if (this.has(code)) {
      this.codes.update((list) => list.filter((c) => c !== code)); // already there: remove
    } else if (!this.isFull()) {
      this.codes.update((list) => [...list, code]); // not there: add if it fits
      this.lastAdded.set(code);
    }
  }

  // stretch goal
  clear(): void {
    this.codes.set([]);
    this.lastAdded.set(null);
  }

  private load(): string[] {
    if (!this.isBrowser) return []; // on the server, start empty
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(stored) ? stored.filter((c) => typeof c === 'string').slice(0, COMPARISON_MAX) : [];
    } catch {
      return []; // corrupted data: start over
    }
  }
}
