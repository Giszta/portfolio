import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MeasurementLine } from "./MeasurementLine";

describe("MeasurementLine", () => {
  it("renders value and unit", () => {
    render(<MeasurementLine value="1280" unit="mm" />);
    expect(screen.getByText("1280")).toBeInTheDocument();
    expect(screen.getByText("mm")).toBeInTheDocument();
  });

  it("is decorative", () => {
    const { container } = render(<MeasurementLine value="1280" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("supports vertical orientation", () => {
    const { container } = render(<MeasurementLine orientation="vertical" />);
    expect(container.firstElementChild).toHaveAttribute("data-orientation", "vertical");
  });
});
