import { Archivo, Geist, JetBrains_Mono } from "next/font/google";

/** Display — nagłówki. Archivo ma oś szerokości (wdth). */
export const fontDisplay = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Body — tekst i UI. */
export const fontSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

/** Mono — koordynaty, etykiety, metadane, pomiary, kod. */
export const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = [fontDisplay.variable, fontSans.variable, fontMono.variable].join(" ");
