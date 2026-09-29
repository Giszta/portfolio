import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonStyles } from "./Button";

describe("Button", () => {
  it("renders an accessible button with its label", () => {
    render(<Button>Label</Button>);
    expect(screen.getByRole("button", { name: "Label" })).toBeInTheDocument();
  });

  it('defaults to type="button" so it never submits forms by accident', () => {
    render(<Button>Label</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows overriding the type", () => {
    render(<Button type="submit">Label</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Label</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Label
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies variant styles and lets className override them", () => {
    render(
      <Button variant="secondary" className="px-10">
        Label
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-line-strong", "px-10");
    expect(button).not.toHaveClass("px-4");
  });
});

describe("buttonStyles", () => {
  it("returns primary/md styles by default", () => {
    const classes = buttonStyles();
    expect(classes).toContain("bg-accent");
    expect(classes).toContain("h-10");
  });
});
