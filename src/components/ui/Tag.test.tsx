import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders as span by default", () => {
    render(<Tag>TypeScript</Tag>);
    expect(screen.getByText("TypeScript").tagName).toBe("SPAN");
  });

  it("renders as list item inside a list", () => {
    render(
      <ul>
        <Tag as="li">TypeScript</Tag>
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("TypeScript");
  });

  it("renders the engineering view as a dashed tag", () => {
    render(<Tag view="engineering">SolidWorks</Tag>);
    const tag = screen.getByText("SolidWorks");
    expect(tag).toHaveAttribute("data-view", "engineering");
    expect(tag).toHaveClass("border-dashed", "text-view-engineering");
    expect(tag).not.toHaveClass("text-fg-secondary");
  });

  it("keeps the default look when no view is given", () => {
    render(<Tag>TypeScript</Tag>);
    expect(screen.getByText("TypeScript")).not.toHaveAttribute("data-view");
  });
});
