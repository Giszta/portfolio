import { screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { projectsByTier } from "@/content/projects";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ProjectsSection } from "./ProjectsSection";

const t = createTranslator({ locale: "en", messages: en, namespace: "projects" });

describe("ProjectsSection", () => {
  it("is the projects region, named by its heading", () => {
    renderWithIntl(<ProjectsSection />);
    expect(screen.getByRole("region", { name: t("title") })).toHaveAttribute("id", "projects");
  });

  it("renders one sheet per featured project, in data order", () => {
    renderWithIntl(<ProjectsSection />);
    const names = screen.getAllByRole("article").map((sheet) => sheet.getAttribute("data-slug"));
    expect(names).toEqual(projectsByTier("featured").map((project) => project.slug));
  });
});