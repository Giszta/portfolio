import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserFrame } from "./BrowserFrame";

describe("BrowserFrame", () => {
  it("shows the host in the address bar", () => {
    render(
      <BrowserFrame url="https://www.fotoroman.pl/">
        <p>content</p>
      </BrowserFrame>,
    );
    expect(screen.getByTestId("browser-chrome")).toHaveTextContent("fotoroman.pl");
  });

  it("hides the decorative chrome from assistive tech", () => {
    render(
      <BrowserFrame url="https://twojdoradca.pl">
        <p>content</p>
      </BrowserFrame>,
    );
    expect(screen.getByTestId("browser-chrome")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders its content", () => {
    render(
      <BrowserFrame url="https://twojdoradca.pl">
        <p>content</p>
      </BrowserFrame>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});