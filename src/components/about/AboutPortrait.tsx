import Image from "next/image";
import { useTranslations } from "next-intl";
import portrait from "@/content/about/images/portrait.webp";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils/cn";

const PORTRAIT_SIZES = "(min-width: 1024px) 824px, 520px";

/**
 * Zdjęcie ma czarne tło, nie przezroczyste. `mix-blend-lighten` zlewa je z canvasem,
 * a maska radialna wygasza krawędzie — kadr nie ma widocznej ramki.
 * Blend i maska siedzą na wrapperze: maska tworzy kontekst nakładania,
 * więc na samym obrazku blend nie miałby z czym się mieszać.
 */
const FADE = "[mask-image:radial-gradient(ellipse_52%_62%_at_47%_46%,#000_40%,transparent_100%)]";

interface AboutPortraitProps {
  className?: string;
}

export function AboutPortrait({ className }: AboutPortraitProps) {
  const t = useTranslations("about");

  return (
    <figure className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute top-0 left-1/2 aspect-[824/720] h-full max-h-[720px] -translate-x-[47%] mix-blend-lighten",
          FADE,
        )}
      >
        <Image
          src={portrait}
          alt={t("photoAlt")}
          fill
          sizes={PORTRAIT_SIZES}
          placeholder="blur"
          unoptimized
          className="object-cover"
        />
      </div>
      <figcaption className="absolute bottom-6 left-4 z-10 font-mono text-label tracking-widest text-fg-muted uppercase sm:left-6 lg:left-8">
        {t("caption", { name: siteConfig.name })}
      </figcaption>
    </figure>
  );
}
