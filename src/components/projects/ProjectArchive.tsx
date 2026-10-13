import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getProjectCopy, type Project } from "@/content/projects";
import { formatYearRange } from "@/lib/years";
import { GithubMark } from "./GithubMark";
import { ProjectLink } from "./ProjectLink";
import { TechList } from "./TechList";

interface ProjectArchiveProps {
  projects: readonly Project[];
}

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <details className="group mt-12 border border-dashed border-line">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 px-5 py-4 font-mono text-sm text-fg-secondary transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
        <ChevronRight
          aria-hidden="true"
          className="size-4 transition-transform group-open:rotate-90 motion-reduce:transition-none"
        />
        {t("archive.title", { count: projects.length })}
      </summary>

      <ul className="border-t border-dashed border-line">
        {projects.map((project) => {
          const { slug, name, stack, links, period } = project;
          return (
            <li
              key={slug}
              data-slug={slug}
              className="grid gap-4 border-b border-line px-5 py-5 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-semibold text-fg">{name}</h3>
                  <span className="font-mono text-xs text-fg-muted">{formatYearRange(period)}</span>
                </div>
                <p className="mt-1 max-w-prose text-sm text-fg-secondary">
                  {getProjectCopy(slug, locale).description}
                </p>
                <TechList stack={stack} label={t("titleBlock.stack")} className="mt-3" />
              </div>

              <div className="flex flex-wrap gap-2">
                {links.demo !== null && (
                  <ProjectLink href={links.demo} label={t("links.demoLabel", { project: name })}>
                    {t("links.demo")}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </ProjectLink>
                )}
                <ProjectLink href={links.repo} label={t("links.repoLabel", { project: name })}>
                  <GithubMark className="size-4" />
                  {t("links.repo")}
                </ProjectLink>
              </div>
            </li>
          );
        })}
      </ul>
    </details>
  );
}