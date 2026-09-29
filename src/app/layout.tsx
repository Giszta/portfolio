import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh bg-canvas font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
