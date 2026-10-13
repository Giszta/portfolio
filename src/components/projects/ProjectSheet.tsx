import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { StatusIndicator } from "@/components/technical";
import type { Project, ProjectCopy, ProjectScreenshot } from "@/content/projects";
import { formatYearRange } from "@/lib/years";
import { BrowserFrame } from "./BrowserFrame";
import { GithubMark } from "./GithubMark";
import { ProjectLink } from "./ProjectLink";
import { TechList } from "./TechList";

interface ProjectSheetProps {
  project: Project;
  copy: ProjectCopy;
  screenshot: ProjectScreenshot | null;
  number: number;
  total: number;
}

const pad = (value: number) => String(value).padStart(2, "0");

const SCREENSHOT_SIZES = "(min-width: 1024px) 600px, 100vw";

export function ProjectSheet({ project, copy, screenshot, number, total }: ProjectSheetProps) {
  const t = useTranslations("projects");
  const { slug, name, stack, links, period } = project;
  const headingId = `project-${slug}`;

  return (
    <article
      aria-labelledby={headingId}
      data-slug={slug}
      className="relative border border-line bg-card p-5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] sm:p-7"
    >

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-line/60"
      />

      <div className="relative grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-8">
        <BrowserFrame url={links.demo ?? links.repo}>
          {screenshot ? (
            <Image
              src={screenshot.image}
              alt={screenshot.alt}
              fill
              sizes={SCREENSHOT_SIZES}
              placeholder="blur"
              className="object-cover object-top"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:16px_16px]"
            />
          )}
        </BrowserFrame>

        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label text-fg-muted uppercase">
            <span>{t("sheetLabel", { number: pad(number), total: pad(total) })}</span>
            {links.demo !== null && (
              <StatusIndicator status="success" label={t("status.online")} />
            )}
          </div>
          <h3 id={headingId} className="mt-2 font-display text-3xl text-fg">
            {name}
          </h3>
          <p className="mt-3 max-w-prose text-fg-secondary">{copy.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {links.demo !== null && (
              <ProjectLink
                href={links.demo}
                label={t("links.demoLabel", { project: name })}
                variant="primary"
              >
                {t("links.demo")}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </ProjectLink>
            )}
            <ProjectLink href={links.repo} label={t("links.repoLabel", { project: name })}>
              <GithubMark className="size-4" />
              {t("links.repo")}
            </ProjectLink>
          </div>
        </div>
      </div>

      <dl className="relative mt-6 grid border border-line font-mono text-xs sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="border-b border-line p-3 sm:col-span-2 lg:col-span-1 lg:border-r lg:border-b-0">
          <dt className="mb-2 text-label text-fg-muted uppercase">{t("titleBlock.stack")}</dt>
          <dd>
            <TechList stack={stack} label={t("titleBlock.stack")} />
          </dd>
        </div>
        <div className="border-r border-line p-3">
          <dt className="mb-2 text-label text-fg-muted uppercase">{t("titleBlock.year")}</dt>
          <dd className="text-sm text-fg">{formatYearRange(period)}</dd>
        </div>
        <div className="p-3">
          <dt className="mb-2 text-label text-fg-muted uppercase">{t("titleBlock.sheet")}</dt>
          <dd className="text-sm text-fg">
            {pad(number)} / {pad(total)}
          </dd>
        </div>
      </dl>
    </article>
  );
}