import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { SHAFT_STEPS } from "@/content/hero/shaft";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ShaftCutMobile } from "./ShaftCutMobile";

const views = en.hero.cut.views;
const group = () => screen.getByRole("group", { name: en.hero.cut.viewsLabel });
const viewButton = (name: string) => within(group()).getByRole("button", { name });

describe("ShaftCutMobile", () => {
  it("presents the shaft as one labelled image", () => {
    renderWithIntl(<ShaftCutMobile />);
    expect(screen.getByRole("img", { name: en.hero.cut.figure })).toBeInTheDocument();
  });

  it("offers three views with the A–A section selected", () => {
    renderWithIntl(<ShaftCutMobile />);
    expect(within(group()).getAllByRole("button")).toHaveLength(3);
    expect(viewButton(views.section)).toHaveAttribute("aria-pressed", "true");
    expect(viewButton(views.drawing)).toHaveAttribute("aria-pressed", "false");
    expect(viewButton(views.code)).toHaveAttribute("aria-pressed", "false");
  });

  it("switches to the code view", () => {
    renderWithIntl(<ShaftCutMobile />);
    fireEvent.click(viewButton(views.code));
    expect(viewButton(views.code)).toHaveAttribute("aria-pressed", "true");
    expect(viewButton(views.section)).toHaveAttribute("aria-pressed", "false");
  });

  it("switches to the drawing view", () => {
    renderWithIntl(<ShaftCutMobile />);
    fireEvent.click(viewButton(views.drawing));
    expect(viewButton(views.drawing)).toHaveAttribute("aria-pressed", "true");
  });

  it("dimensions every step with its nominal diameter only", () => {
    renderWithIntl(<ShaftCutMobile />);
    expect(screen.getAllByText(/^Ø\d+$/)).toHaveLength(SHAFT_STEPS.length);
  });
});
