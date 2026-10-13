import { screen, within } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { getProjectCopy, projectsByTier } from "@/content/projects";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ProjectArchive } from "./ProjectArchive";

const t = createTranslator({ locale: "en", messages: en, namespace: "projects" });
const archive = projectsByTier("archive");

function renderArchive() {
  return renderWithIntl(<ProjectArchive projects={archive} />);
}

describe("ProjectArchive", () => {
  it("is collapsed by default, with the project count in its summary", () => {
    renderArchive();
    const summary = screen.getByText(t("archive.title", { count: archive.length }));
    const details = summary.closest("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");
  });

  it("lists every archived project with its description, in data order", () => {
    renderArchive();
    const headings = screen.getAllByRole("heading", { level: 3, hidden: true });
    expect(headings.map((heading) => heading.textContent)).toEqual(
      archive.map((project) => project.name),
    );
    for (const project of archive) {
      expect(screen.getByText(getProjectCopy(project.slug, "en").description)).toBeInTheDocument();
    }
  });

  it("links every project to its repo, and to its demo only when there is one", () => {
    const { container } = renderArchive();
    for (const project of archive) {
      const item = container.querySelector(`[data-slug="${project.slug}"]`) as HTMLElement;
      const links = within(item).getAllByRole("link", { hidden: true });
      const hrefs = links.map((link) => link.getAttribute("href"));
      expect(hrefs).toContain(project.links.repo);
      if (project.links.demo === null) {
        expect(links).toHaveLength(1);
      } else {
        expect(hrefs).toContain(project.links.demo);
      }
    }
  });
});