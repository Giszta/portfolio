import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders a semantic <hr> by default", () => {
    render(<Divider />);
    expect(screen.getByRole("separator").tagName).toBe("HR");
  });

  it("renders a vertical separator with aria-orientation", () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("is hidden from assistive tech when decorative", () => {
    render(<Divider decorative />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});
