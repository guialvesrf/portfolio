import type { Bilingual, Locale } from "@/lib/i18n";
import { nav, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { socials } from "./Contact";

const content: Bilingual<{
  tagline: string;
  footer: string;
  navigation: string;
  contact: string;
  built: string;
  top: string;
  newTab: string;
}> = {
  pt: {
    tagline: "Back-end em tempo real",
    footer: "Rodapé",
    navigation: "Navegação",
    contact: "Contato",
    built: "Feito com Next.js, Tailwind e Motion",
    top: "Voltar ao topo",
    newTab: "(abre em nova aba)",
  },
  en: {
    tagline: "Real-time back-end",
    footer: "Footer",
    navigation: "Navigation",
    contact: "Contact",
    built: "Built with Next.js, Tailwind and Motion",
    top: "Back to top",
    newTab: "(opens in a new tab)",
  },
};

const link = "inline-flex min-h-10 items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg";

export function Footer({ lang }: { lang: Locale }) {
  const t = content[lang];
  const columns = [
    { label: t.navigation, links: nav[lang].map((l) => ({ label: l.label, href: `#${l.id}`, external: false })) },
    { label: "Social", links: socials.map((s) => ({ ...s, external: true })) },
    { label: t.contact, links: [{ label: site.email, href: `mailto:${site.email}`, external: false }], wide: true },
  ];

  return (
    <footer className="border-t border-line bg-ink-950">
      <Container className="flex flex-col gap-12 pb-8 pt-16 sm:gap-14 sm:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <Reveal className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Logo size={24} />
              <span className="font-pixel text-xl leading-none text-fg">{site.name}</span>
            </div>
            <p className="text-sm text-fg-muted">{t.tagline}</p>
          </Reveal>

          {/* 2×N no mobile (Contato ocupa a linha inteira por causa do e-mail), 3 colunas a partir do sm. */}
          <nav aria-label={t.footer} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[1fr_1fr_auto] sm:gap-x-10 lg:grid-cols-[repeat(3,auto)] lg:gap-x-20">
            {columns.map((col, ci) => (
              <div key={col.label} className={col.wide ? "col-span-2 sm:col-span-1" : ""}>
                <Reveal delay={ci * 0.1} y={8}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{col.label}</p>
                </Reveal>
                <ul className="mt-3 flex flex-col">
                  {col.links.map((l, li) => (
                    <li key={l.href}>
                      <Reveal delay={ci * 0.1 + (li + 1) * 0.05} y={8}>
                        <a
                          href={l.href}
                          className={link}
                          {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
                        >
                          {l.label}
                          {l.external && (
                            <>
                              <span aria-hidden className="text-fg-subtle">↗</span>
                              <span className="sr-only">{t.newTab}</span>
                            </>
                          )}
                        </a>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div aria-hidden className="dot-grid h-10" />

        <div className="flex flex-col gap-2 text-[13px] text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>© 2026 {site.name}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <p className="py-2 sm:py-0">{t.built}</p>
            <a href="#top" className="inline-flex min-h-10 items-center gap-1.5 text-fg-muted transition-colors hover:text-fg">
              {t.top}
              <span aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
