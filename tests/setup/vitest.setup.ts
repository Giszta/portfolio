import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * jsdom nie implementuje IntersectionObserver, a komponenty z <Reveal> montują się
 * w testach stron. Reveal.test.tsx podmienia go własnym mockiem (vi.stubGlobal),
 * więc ten domyślny mu nie przeszkadza.
 */
if (typeof globalThis.IntersectionObserver === "undefined") {
  class NoopIntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
    takeRecords = (): IntersectionObserverEntry[] => [];
  }
  globalThis.IntersectionObserver =
    NoopIntersectionObserver as unknown as typeof IntersectionObserver;
}

afterEach(() => {
  cleanup();
});
