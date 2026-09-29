import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, "isIntersecting">>) => void;

let triggerIntersection: ObserverCallback = () => undefined;
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback: ObserverCallback) {
    triggerIntersection = callback;
  }
  observe = vi.fn();
  disconnect = disconnect;
}

describe("Reveal", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    disconnect.mockClear();
  });

  it("always renders children (content is in the DOM for SEO / no-JS)", () => {
    render(<Reveal>Content</Reveal>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("starts hidden and becomes visible when intersecting", () => {
    render(<Reveal>Content</Reveal>);
    const wrapper = screen.getByText("Content");
    expect(wrapper).toHaveAttribute("data-reveal", "hidden");

    act(() => triggerIntersection([{ isIntersecting: true }]));

    expect(wrapper).toHaveAttribute("data-reveal", "visible");
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays hidden while not intersecting", () => {
    render(<Reveal>Content</Reveal>);
    act(() => triggerIntersection([{ isIntersecting: false }]));
    expect(screen.getByText("Content")).toHaveAttribute("data-reveal", "hidden");
  });

  it("applies transition delay", () => {
    render(<Reveal delay={150}>Content</Reveal>);
    expect(screen.getByText("Content")).toHaveStyle({ transitionDelay: "150ms" });
  });
});
