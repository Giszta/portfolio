import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  it("becomes a named region when labelled by its heading", () => {
    render(
      <Section aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Projects" })).toBeInTheDocument();
  });

  it("applies tone and spacing", () => {
    render(<Section data-testid="s" tone="surface" spacing="compact" />);
    expect(screen.getByTestId("s")).toHaveClass("bg-surface", "py-12");
  });
});
