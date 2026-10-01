import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useScrolled } from "./useScrolled";

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true, writable: true });
}

function scrollTo(y: number) {
  act(() => {
    setScrollY(y);
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("useScrolled", () => {
  afterEach(() => {
    setScrollY(0);
    vi.restoreAllMocks();
  });

  it("is false at the top of the page", () => {
    const { result } = renderHook(() => useScrolled());
    expect(result.current).toBe(false);
  });

  it("becomes true after scrolling past the threshold", () => {
    const { result } = renderHook(() => useScrolled());
    scrollTo(100);
    expect(result.current).toBe(true);
  });

  it("returns to false when scrolled back to the top", () => {
    const { result } = renderHook(() => useScrolled());
    scrollTo(100);
    scrollTo(0);
    expect(result.current).toBe(false);
  });

  it("respects a custom threshold", () => {
    const { result } = renderHook(() => useScrolled(200));
    scrollTo(150);
    expect(result.current).toBe(false);
    scrollTo(250);
    expect(result.current).toBe(true);
  });

  it("removes the scroll listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrolled());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
