import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TechnicalDivider } from "./TechnicalDivider";

describe("TechnicalDivider", () => {
  it("is decorative", () => {
    const { container } = render(<TechnicalDivider code="SEC-02" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("SEC-02")).toBeInTheDocument();
  });
});
