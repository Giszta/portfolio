import { screen, within } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { getProjectCopy, PROJECTS, type Project, type ProjectSlug } from "@/content/projects";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ProjectSheet } from "./ProjectSheet";

const t = createTranslator({ locale: "en", messages: en, namespace: "projects" });

function project(slug: ProjectSlug): Project {
  const found = PROJECTS.find((item) => item.slug === slug);
  if (!found) throw new Error(`Unknown project: ${slug}`);
  return found;
}

function renderSheet(item: Project, number = 1, total = 4) {
  return renderWithIntl(
    <ProjectSheet
      project={item}
      copy={getProjectCopy(item.slug, "en")}
      number={number}
      total={total}
    />,
  );
}

describe("ProjectSheet", () => {
  it("is an article named by its level-3 heading", () => {
    renderSheet(project("nexus"));
    expect(screen.getByRole("article", { name: "NEXUS" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "NEXUS" })).toBeInTheDocument();
  });

  it("shows the sheet number and the description", () => {
    renderSheet(project("nexus"), 2, 4);
    expect(screen.getByText(t("sheetLabel", { number: "02", total: "04" }))).toBeInTheDocument();
    expect(screen.getByText(getProjectCopy("nexus", "en").description)).toBeInTheDocument();
  });

  it("links to the live demo and the repo in a new tab", () => {
    const nexus = project("nexus");
    renderSheet(nexus);

    const demo = screen.getByRole("link", { name: t("links.demoLabel", { project: nexus.name }) });
    const repo = screen.getByRole("link", { name: t("links.repoLabel", { project: nexus.name }) });

    expect(demo).toHaveAttribute("href", nexus.links.demo);
    expect(repo).toHaveAttribute("href", nexus.links.repo);
    for (const link of [demo, repo]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("starts each link's accessible name with its visible text (WCAG 2.5.3)", () => {
    renderSheet(project("nexus"));
    for (const link of screen.getAllByRole("link")) {
      const visible = link.textContent?.trim() ?? "";
      expect(visible).not.toBe("");
      expect(link.getAttribute("aria-label")?.startsWith(visible)).toBe(true);
    }
  });

  it("marks projects with a demo as live", () => {
    renderSheet(project("nexus"));
    expect(screen.getByText(t("status.online"))).toBeInTheDocument();
  });

  it("omits the demo link and the live status when there is no demo", () => {
    const portfolio = project("portfolio-v1");
    renderSheet(portfolio);
    expect(
      screen.queryByRole("link", { name: t("links.demoLabel", { project: portfolio.name }) }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(t("status.online"))).not.toBeInTheDocument();
  });

  it("lists the stack in the title block", () => {
    const tickets = project("support-tickets");
    renderSheet(tickets);
    const list = screen.getByRole("list", { name: t("titleBlock.stack") });
    expect(within(list).getAllByRole("listitem")).toHaveLength(tickets.stack.length);
  });

  it("shows the year range in the title block", () => {
    renderSheet(project("fotoroman"));
    expect(screen.getByText("2023\u20132025")).toBeInTheDocument();
  });
});