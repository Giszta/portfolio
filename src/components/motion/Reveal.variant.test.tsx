import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "./Reveal";

describe("Reveal variants", () => {
  it("has no variant attribute by default", () => {
    render(<Reveal>Content</Reveal>);
    expect(screen.getByText("Content")).not.toHaveAttribute("data-reveal-variant");
  });

  it.each(["portrait", "stagger"] as const)("marks the %s variant", (variant) => {
    render(<Reveal variant={variant}>Content</Reveal>);
    expect(screen.getByText("Content")).toHaveAttribute("data-reveal-variant", variant);
  });
});
