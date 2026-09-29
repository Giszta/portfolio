import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import {
  CoordinateLabel,
  CutLabel,
  CutLine,
  DataPoint,
  formatCutMark,
  GridPattern,
  MeasurementLine,
  SectionLabel,
  StatusIndicator,
  TechnicalBadge,
  TechnicalDivider,
  ViewLabel,
  type Status,
} from "@/components/technical";
import {
  Badge,
  Button,
  Card,
  Container,
  IconButton,
  Section,
  Tag,
  type BadgeTone,
} from "@/components/ui";
import { designPreview as p } from "@/content/design-preview";
import { ColorSwatches } from "./_components/ColorSwatches";
import { PreviewBlock } from "./_components/PreviewBlock";
import { VIEWS } from "@/types/view";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const badgeTones: BadgeTone[] = ["success", "warning", "info", "neutral"];
const statuses = Object.keys(p.status) as Status[];

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main id="main-content">
      <Section className="overflow-hidden">
        <GridPattern variant="blueprint" />
        <Container className="flex flex-col gap-16">
          <header className="flex flex-col gap-4">
            <SectionLabel index={0} label={p.title} />
            <h1 className="font-display text-display-lg font-semibold">{p.title}</h1>
            <p className="max-w-2xl text-fg-secondary">{p.intro}</p>
          </header>

          <PreviewBlock index={1} title={p.sections.colors}>
            <ColorSwatches />
          </PreviewBlock>

          <PreviewBlock index={2} title={p.sections.typography}>
            <p className="font-display text-display-xl font-semibold">{p.typography.display}</p>
            <p className="max-w-2xl text-lg text-fg-secondary">{p.typography.body}</p>
            <p className="font-mono text-label text-fg-muted uppercase">{p.typography.mono}</p>
            <p className="text-fg">{p.typography.polish}</p>
          </PreviewBlock>

          <PreviewBlock index={3} title={p.sections.buttons}>
            <div className="flex flex-wrap items-center gap-3">
              <Button>{p.buttons.primary}</Button>
              <Button variant="secondary">{p.buttons.secondary}</Button>
              <Button variant="ghost">{p.buttons.ghost}</Button>
              <Button disabled>{p.buttons.disabled}</Button>
              <IconButton label={p.buttons.icon} icon={<MenuIcon />} variant="secondary" />
            </div>
          </PreviewBlock>

          <PreviewBlock index={4} title={p.sections.badges}>
            <div className="flex flex-wrap gap-2">
              {p.badges.map((badge, i) => (
                <Badge key={badge} tone={badgeTones[i]}>
                  {badge}
                </Badge>
              ))}
            </div>
            <ul className="flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <Tag key={tag} as="li">
                  {tag}
                </Tag>
              ))}
            </ul>
            <div className="flex flex-wrap gap-6">
              {statuses.map((status) => (
                <StatusIndicator
                  key={status}
                  status={status}
                  label={p.status[status]}
                  pulse={status === "success"}
                />
              ))}
            </div>
          </PreviewBlock>

          <PreviewBlock index={5} title={p.sections.cards}>
            <div className="grid gap-6 md:grid-cols-2">
              <Card as="article" corners interactive className="flex flex-col gap-3">
                <TechnicalBadge code={p.technical.badge.code} value={p.technical.badge.value} />
                <h3 className="font-display text-2xl font-semibold">{p.card.title}</h3>
                <p className="text-fg-secondary">{p.card.subtitle}</p>
                <p className="text-sm text-fg-muted">{p.card.body}</p>
              </Card>
              <Card className="overflow-hidden">
                <GridPattern variant="technical" fade={false} />
                <dl className="grid grid-cols-3 gap-4">
                  {p.technical.dataPoints.map((point) => (
                    <DataPoint key={point.label} {...point} />
                  ))}
                </dl>
              </Card>
            </div>
          </PreviewBlock>

          <PreviewBlock index={6} title={p.sections.technical}>
            <div className="flex flex-col gap-8">
              <MeasurementLine
                value={p.technical.measurement.value}
                unit={p.technical.measurement.unit}
              />
              <CoordinateLabel coordinates={p.technical.coordinates} />
              <SectionLabel index={2} label={p.technical.sectionLabel} />
              <TechnicalDivider code={p.technical.divider} />
              <div className="flex h-40 gap-6">
                <MeasurementLine orientation="vertical" value={p.technical.measurement.value} />
                <Card className="flex-1" corners />
              </div>
            </div>
          </PreviewBlock>

          <PreviewBlock index={7} title={p.sections.motion}>
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 120, 240].map((delay) => (
                <Reveal key={delay} delay={delay}>
                  <Card interactive>
                    <p className="text-fg-secondary">{p.motion.reveal}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </PreviewBlock>
          <PreviewBlock index={8} title={p.sections.sectionCut}>
            <p className="font-display text-display-lg font-bold">
              <span className="type-outline">{p.sectionCut.outline}</span> {p.sectionCut.solid}
            </p>

            <div className="flex flex-wrap items-center gap-8">
              {VIEWS.map((view) => (
                <ViewLabel key={view} view={view} label={p.sectionCut.views[view]} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {p.sectionCut.cuts.map((cut) => (
                <CutLabel key={cut.letter} code={formatCutMark(cut.letter)} label={cut.label} />
              ))}
              <CutLabel code={p.sectionCut.numbered.code} label={p.sectionCut.numbered.label} />
            </div>

            <div className="flex flex-wrap gap-2">
              {p.sectionCut.engineeringTags.map((tag) => (
                <Tag key={tag} view="engineering">
                  {tag}
                </Tag>
              ))}
              {p.sectionCut.softwareTags.map((tag) => (
                <Tag key={tag} view="software">
                  {tag}
                </Tag>
              ))}
            </div>

            <div className="grid h-64 grid-cols-[1fr_auto_1fr] gap-6">
              <div className="rounded-sm border border-dashed border-view-engineering/45 pattern-hatch-engineering" />
              <CutLine orientation="vertical" mark="A" />
              <div className="rounded-sm border border-cut/40 pattern-hatch" />
            </div>

            <CutLine orientation="horizontal" mark="A" />
            <CutLine orientation="horizontal" subtle />
          </PreviewBlock>
        </Container>
      </Section>
    </main>
  );
}
