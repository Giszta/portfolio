import { useLocale, useTranslations } from "next-intl";
import { SectionShell } from "@/components/layout";
import { getProjectCopy, projectsByTier } from "@/content/projects";
import { ProjectSheet } from "./ProjectSheet";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const featured = projectsByTier("featured");

  return (
    <SectionShell id="projects" title={t("title")} tone="surface">
      <div className="mt-10 grid gap-10">
        {featured.map((project, index) => (
          <ProjectSheet
            key={project.slug}
            project={project}
            copy={getProjectCopy(project.slug, locale)}
            number={index + 1}
            total={featured.length}
          />
        ))}
      </div>
    </SectionShell>
  );
}