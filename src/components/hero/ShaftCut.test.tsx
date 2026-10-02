import { fireEvent, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import {
  SHAFT_EDGE_CHAMFER,
  SHAFT_END_CHAMFER,
  SHAFT_GENERAL_FILLET,
  SHAFT_STEPS,
  type ShaftStep,
} from "@/content/hero/shaft";
import { filletMarks, shaftLength } from "@/lib/shaft";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ShaftCut } from "./ShaftCut";

const t = createTranslator({ locale: "en", messages: en, namespace: "hero.cut" });
const slider = () => screen.getByRole("slider", { name: en.hero.cut.label });

describe("ShaftCut", () => {
  it("presents the shaft as one labelled image", () => {
    renderWithIntl(<ShaftCut />);
    expect(screen.getByRole("img", { name: en.hero.cut.figure })).toBeInTheDocument();
  });

  it("starts as a 50/50 section with a meaningful value text", () => {
    renderWithIntl(<ShaftCut />);
    expect(slider()).toHaveAttribute("aria-valuenow", "50");
    expect(slider()).toHaveAttribute("aria-valuetext", t("valueText", { drawing: 50, code: 50 }));
  });

  it("moves the cut with the arrow keys", () => {
    renderWithIntl(<ShaftCut />);
    fireEvent.keyDown(slider(), { key: "ArrowRight" });
    expect(slider()).toHaveAttribute("aria-valuenow", "55");

    fireEvent.keyDown(slider(), { key: "ArrowLeft" });
    fireEvent.keyDown(slider(), { key: "ArrowLeft" });
    expect(slider()).toHaveAttribute("aria-valuenow", "45");
    expect(slider()).toHaveAttribute("aria-valuetext", t("valueText", { drawing: 45, code: 55 }));
  });

  it("jumps to the ends with Home and End", () => {
    renderWithIntl(<ShaftCut />);
    fireEvent.keyDown(slider(), { key: "End" });
    expect(slider()).toHaveAttribute("aria-valuenow", "100");
    fireEvent.keyDown(slider(), { key: "Home" });
    expect(slider()).toHaveAttribute("aria-valuenow", "0");
  });

  it("does not swallow keys it does not handle", () => {
    renderWithIntl(<ShaftCut />);
    // fireEvent zwraca false, gdy handler wywołał preventDefault()
    expect(fireEvent.keyDown(slider(), { key: "Tab" })).toBe(true);
    expect(fireEvent.keyDown(slider(), { key: "ArrowRight" })).toBe(false);
  });

  it("generates the dimensions from the shaft data", () => {
    renderWithIntl(<ShaftCut />);
    expect(screen.getAllByText(/^Ø\d+/)).toHaveLength(SHAFT_STEPS.length);
    expect(screen.getByText(String(shaftLength(SHAFT_STEPS)))).toBeInTheDocument();
  });

  it("annotates fits, roughness, edges and sheet notes from the data", () => {
    renderWithIntl(<ShaftCut />);
    const steps: readonly ShaftStep[] = SHAFT_STEPS;

    expect(screen.getAllByText(/^Ø\d+ [a-z]+\d+$/)).toHaveLength(
      steps.filter((s) => s.tolerance).length,
    );
    expect(screen.getAllByText(/^Ra /)).toHaveLength(steps.filter((s) => s.roughness).length);
    expect(screen.getAllByText(/^R\d+$/)).toHaveLength(
      filletMarks(SHAFT_STEPS, SHAFT_GENERAL_FILLET).length,
    );
    expect(screen.getAllByText(`${SHAFT_END_CHAMFER}×45°`)).toHaveLength(2);
    expect(screen.getByText(en.hero.cut.generalTolerances)).toBeInTheDocument();
    expect(
      screen.getByText(t("generalRadii", { radius: SHAFT_GENERAL_FILLET })),
    ).toBeInTheDocument();
    expect(
      screen.getByText(t("generalChamfers", { size: SHAFT_EDGE_CHAMFER })),
    ).toBeInTheDocument();
  });
});
