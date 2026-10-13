import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TECH, type TechId } from "@/content/tech";
import { TechList } from "./TechList";

const STACK: readonly TechId[] = ["nextjs", "typescript", "pgvector"];
const LABEL = "Stack";

describe("TechList", () => {
  it("is a list named by its label", () => {
    render(<TechList stack={STACK} label={LABEL} />);
    expect(screen.getByRole("list", { name: LABEL })).toBeInTheDocument();
  });

  it("renders one item per technology, in stack order", () => {
    render(<TechList stack={STACK} label={LABEL} />);
    const items = within(screen.getByRole("list", { name: LABEL })).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(STACK.map((id) => TECH[id].label));
  });
});