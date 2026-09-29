import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusIndicator } from "./StatusIndicator";

describe("StatusIndicator", () => {
  it("always renders a text label (not color alone)", () => {
    render(<StatusIndicator status="success" label="Available" />);
    expect(screen.getByText("Available")).toBeVisible();
  });

  it("hides the colored dot from assistive tech", () => {
    const { container } = render(<StatusIndicator status="warning" label="In progress" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders pulse only when requested", () => {
    const { container, rerender } = render(<StatusIndicator status="info" label="Live" />);
    expect(container.querySelector("[data-pulse]")).not.toBeInTheDocument();
    rerender(<StatusIndicator status="info" label="Live" pulse />);
    expect(container.querySelector("[data-pulse]")).toBeInTheDocument();
  });
});
