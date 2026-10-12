import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectFolder, type FolderItem } from "./ProjectFolder";

const ITEMS: FolderItem[] = ["A", "B", "C"].map((name) => ({
  id: name.toLowerCase(),
  tab: <span>Tab {name}</span>,
  panel: <p>Panel {name}</p>,
}));

const LABELS = { tablist: "Folder", previous: "Previous", next: "Next" };

function renderFolder() {
  render(<ProjectFolder items={ITEMS} labels={LABELS} />);
  return {
    tabs: screen.getAllByRole("tab"),
    selected: () => screen.getByRole("tab", { selected: true }),
  };
}

describe("ProjectFolder", () => {
  it("is a named tablist with the first tab selected and only its panel shown", () => {
    const { tabs } = renderFolder();
    expect(screen.getByRole("tablist", { name: LABELS.tablist })).toBeInTheDocument();
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByText("Panel B")).not.toBeVisible();
  });

  it("links each tab with its panel", () => {
    const { tabs } = renderFolder();
    const panel = screen.getByRole("tabpanel");
    expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tabs[0]?.id);
  });

  it("keeps only the selected tab in the tab order (roving tabindex)", () => {
    const { tabs } = renderFolder();
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
  });

  it("selects a tab on click", () => {
    const { tabs } = renderFolder();
    fireEvent.click(tabs[1] as HTMLElement);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel B")).toBeVisible();
    expect(screen.getByText("Panel A")).not.toBeVisible();
  });

  it.each([
    ["ArrowDown", "Tab B"],
    ["ArrowRight", "Tab B"],
    ["ArrowUp", "Tab C"],
    ["ArrowLeft", "Tab C"],
    ["End", "Tab C"],
  ])("%s moves selection and focus (wrapping around)", (key, expected) => {
    const { tabs, selected } = renderFolder();
    fireEvent.keyDown(tabs[0] as HTMLElement, { key });
    expect(selected()).toHaveTextContent(expected);
    expect(selected()).toHaveFocus();
  });

  it("Home jumps back to the first tab", () => {
    const { tabs, selected } = renderFolder();
    fireEvent.click(tabs[2] as HTMLElement);
    fireEvent.keyDown(tabs[2] as HTMLElement, { key: "Home" });
    expect(selected()).toHaveTextContent("Tab A");
  });

  it("ignores unrelated keys", () => {
    const { tabs, selected } = renderFolder();
    fireEvent.keyDown(tabs[0] as HTMLElement, { key: "a" });
    expect(selected()).toHaveTextContent("Tab A");
  });

  it("previous and next buttons switch sheets and wrap around", () => {
    const { selected } = renderFolder();
    fireEvent.click(screen.getByRole("button", { name: LABELS.previous }));
    expect(selected()).toHaveTextContent("Tab C");
    fireEvent.click(screen.getByRole("button", { name: LABELS.next }));
    expect(selected()).toHaveTextContent("Tab A");
  });
});