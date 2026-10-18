import { useLocale, useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui";
import { getProjectCopy, getScreenshot, projectsByTier } from "@/content/projects";
import { formatYearRange } from "@/lib/years";
import { ProjectArchive } from "./ProjectArchive";
import { ProjectFolder, type FolderItem } from "./ProjectFolder";
import { ProjectSheet } from "./ProjectSheet";

const HEADING_ID = "projects-title";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const featured = projectsByTier("featured");

  const items: FolderItem[] = featured.map((project, index) => ({
    id: project.slug,
    tab: (
      <span className="grid grid-cols-[1.75rem_1fr] gap-x-2">
        <span className="row-span-2 pt-0.5 font-mono text-label text-fg-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-semibold">{project.name}</span>
        <span className="font-mono text-xs text-fg-muted">{formatYearRange(project.period)}</span>
      </span>
    ),
    panel: (
      <ProjectSheet
        project={project}
        copy={getProjectCopy(project.slug, locale)}
        screenshot={getScreenshot(project.slug, locale)}
        number={index + 1}
        total={featured.length}
      />
    ),
  }));

  return (
    <Section id="projects" aria-labelledby={HEADING_ID} tone="surface">
      <Container>
        <h2 id={HEADING_ID} className="font-display text-display-md text-fg">
          <span className="block type-outline">{t("titleOutline")}</span>{" "}
          <span className="block">{t("titleSolid")}</span>
        </h2>
        <ProjectFolder
          items={items}
          labels={{
            tablist: t("folder.tablist"),
            previous: t("folder.previous"),
            next: t("folder.next"),
          }}
        />
        <ProjectArchive projects={projectsByTier("archive")} />
      </Container>
    </Section>
  );
}
