import { screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { projectsByTier } from "@/content/projects";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ProjectsSection } from "./ProjectsSection";

const t = createTranslator({ locale: "en", messages: en, namespace: "projects" });
const featured = projectsByTier("featured");

describe("ProjectsSection", () => {
  it("is the projects region, named by its heading", () => {
    renderWithIntl(<ProjectsSection />);
    expect(
      screen.getByRole("region", { name: `${t("titleOutline")} ${t("titleSolid")}` }),
    ).toHaveAttribute("id", "projects");
  });

  it("has one tab per featured project, in data order", () => {
    renderWithIntl(<ProjectsSection />);
    const tablist = screen.getByRole("tablist", { name: t("folder.tablist") });
    const tabs = screen.getAllByRole("tab");
    expect(tablist).toContainElement(tabs[0] ?? null);
    expect(tabs).toHaveLength(featured.length);
    featured.forEach((project, index) => {
      expect(tabs[index]).toHaveTextContent(project.name);
    });
  });

  it("puts every sheet in the HTML but shows only the first", () => {
    renderWithIntl(<ProjectsSection />);
    const all = screen.getAllByRole("article", { hidden: true });
    expect(all.map((sheet) => sheet.getAttribute("data-slug"))).toEqual(
      featured.map((project) => project.slug),
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });
});
