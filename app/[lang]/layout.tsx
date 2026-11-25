import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const meta = {
  pt: {
    title: "Guilherme Alves · Desenvolvedor Back-End",
    description: "Back-end em Go, TypeScript/Bun e Python. Sistemas em tempo real, controle adaptativo e segurança.",
  },
  en: {
    title: "Guilherme Alves · Back-End Developer",
    description: "Back-end in Go, TypeScript/Bun and Python. Real-time systems, adaptive control and security.",
  },
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const m = meta[hasLocale(lang) ? lang : "pt"];
  return {
    title: m.title,
    description: m.description,
    alternates: { languages: { "pt-BR": "/pt", en: "/en" } },
    openGraph: { title: m.title, description: m.description, type: "website" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
