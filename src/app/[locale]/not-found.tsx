import { useTranslations } from "next-intl";
import { CutLabel } from "@/components/technical";
import { buttonStyles, Container } from "@/components/ui";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <main id="main-content" className="flex min-h-dvh items-center">
      <Container size="narrow" className="flex flex-col items-start gap-6">
        <CutLabel code="404" />
        <h1 className="font-display text-display-md font-bold">{t("title")}</h1>
        <p className="text-fg-secondary">{t("description")}</p>
        <Link href="/" className={buttonStyles({ variant: "secondary" })}>
          {t("backHome")}
        </Link>
      </Container>
    </main>
  );
}
