import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ACTIVATION_LINE, useActiveSection } from "./useActiveSection";

const IDS = ["home", "about", "contact"] as const;

let callback: IntersectionObserverCallback | undefined;
let options: IntersectionObserverInit | undefined;
const observeSpy = vi.fn();
const disconnectSpy = vi.fn();

class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback, init?: IntersectionObserverInit) {
    callback = cb;
    options = init;
  }
  observe = observeSpy;
  unobserve = vi.fn();
  disconnect = disconnectSpy;
  takeRecords = () => [];
}

function intersect(id: string, isIntersecting = true) {
  const cb = callback;
  const target = document.getElementById(id);
  if (!cb || !target) throw new Error(`No observer or element for #${id}`);
  const entry = { target, isIntersecting } as unknown as IntersectionObserverEntry;
  act(() => cb([entry], {} as IntersectionObserver));
}

describe("useActiveSection", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    document.body.innerHTML = IDS.map((id) => `<section id="${id}"></section>`).join("");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    callback = undefined;
    options = undefined;
    document.body.innerHTML = "";
  });

  it("returns null before any section is measured", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current).toBeNull();
  });

  it("observes every section that exists in the document", () => {
    document.getElementById("contact")?.remove();
    renderHook(() => useActiveSection(IDS));
    expect(observeSpy).toHaveBeenCalledTimes(2);
  });

  it("uses a thin activation line instead of whole-viewport visibility", () => {
    renderHook(() => useActiveSection(IDS));
    expect(options?.rootMargin).toBe(ACTIVATION_LINE);
  });

  it("reports the section crossing the activation line", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    intersect("about");
    expect(result.current).toBe("about");
    intersect("contact");
    expect(result.current).toBe("contact");
  });

  it("ignores sections leaving the line", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    intersect("about");
    intersect("home", false);
    expect(result.current).toBe("about");
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderHook(() => useActiveSection(IDS));
    unmount();
    expect(disconnectSpy).toHaveBeenCalledOnce();
  });
});
