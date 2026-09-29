import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GridPattern } from "./GridPattern";

describe("GridPattern", () => {
  it("is decorative (hidden from assistive tech)", () => {
    const { container } = render(<GridPattern />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it.each([
    ["technical", "pattern-technical"],
    ["blueprint", "pattern-blueprint"],
  ] as const)("renders %s variant", (variant, expectedClass) => {
    const { container } = render(<GridPattern variant={variant} />);
    expect(container.firstElementChild).toHaveClass(expectedClass);
  });

  it("can disable the fade mask", () => {
    const { container } = render(<GridPattern fade={false} />);
    expect(container.firstElementChild).not.toHaveClass("pattern-fade");
  });
});
