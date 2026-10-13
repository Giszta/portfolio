import { useLocale, useTranslations } from "next-intl";
import { SectionShell } from "@/components/layout";
import { getProjectCopy, getScreenshot, projectsByTier } from "@/content/projects";
import { formatYearRange } from "@/lib/years";
import { ProjectArchive } from "./ProjectArchive";
import { ProjectFolder, type FolderItem } from "./ProjectFolder";
import { ProjectSheet } from "./ProjectSheet";

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
    <SectionShell id="projects" title={t("title")} tone="surface">
      <ProjectFolder
        items={items}
        labels={{
          tablist: t("folder.tablist"),
          previous: t("folder.previous"),
          next: t("folder.next"),
        }}
      />
      <ProjectArchive projects={projectsByTier("archive")} />
    </SectionShell>
  );
}