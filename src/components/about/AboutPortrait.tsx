import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion";
import portrait from "@/content/about/images/portrait.webp";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils/cn";

const PORTRAIT_SIZES = "(min-width: 1024px) 824px, 520px";

/**
 * Zdjęcie ma czarne tło, nie przezroczyste. Kontener ma własny kolor canvas, więc
 * siatka tła strony nie przebija przez twarz, a `mix-blend-lighten` na samym obrazku
 * zlewa czerń zdjęcia z tym kolorem. Maska radialna wygasza kontener do krawędzi —
 * dopiero tam siatka wraca, bez widocznej ramki.
 * Blend jest na obrazku, nie na kontenerze: kontener z maską tworzy własną grupę
 * nakładania, więc obrazek miesza się z jego tłem, a nie z siatką pod spodem.
 */
const FADE = "[mask-image:radial-gradient(ellipse_52%_62%_at_47%_46%,#000_40%,transparent_100%)]";

interface AboutPortraitProps {
  className?: string;
}

export function AboutPortrait({ className }: AboutPortraitProps) {
  const t = useTranslations("about");

  return (
    // overflow-clip, nie -hidden: hidden robi z figure kontener przewijania i psuje sticky.
    <figure className={cn("relative overflow-clip", className)}>
      {/* Na desktopie ramka zostaje pod nagłówkiem (top-20), gdy tekst obok się przewija. */}
      <div className="relative h-full lg:sticky lg:top-20 lg:h-[calc(100dvh-5rem)]">
        {/* Reveal ma własny element: jego `translate` kolidowałby z -translate-x poniżej. */}
        <Reveal variant="portrait" className="absolute inset-0 origin-[47%_46%]">
          <div
            className={cn(
              "absolute top-0 left-1/2 aspect-[824/720] h-full max-h-[720px] -translate-x-[47%] bg-canvas",
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
              className="object-cover mix-blend-lighten"
            />
          </div>
        </Reveal>
        <figcaption className="absolute bottom-6 left-4 z-10 font-mono text-label tracking-widest text-fg-muted uppercase sm:left-6 lg:left-8">
          {t("caption", { name: siteConfig.name })}
        </figcaption>
      </div>
    </figure>
  );
}
