import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./IconButton";

const Icon = () => <svg data-testid="icon" />;

describe("IconButton", () => {
  it("uses `label` as the accessible name", () => {
    render(<IconButton label="Open menu" icon={<Icon />} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("hides the icon from assistive technology", () => {
    render(<IconButton label="Open menu" icon={<Icon />} />);
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("requires a label at the type level", () => {
    // @ts-expect-error — `label` is required; `npm run typecheck` fails if it becomes optional
    render(<IconButton icon={<Icon />} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
