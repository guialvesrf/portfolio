import type { Bilingual, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { EmailCopy } from "./contact/EmailCopy";

/** Redes na ordem de exibição (também usadas no Footer). */
export const socials = [
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "GitHub", href: site.social.github },
  { label: "Instagram", href: site.social.instagram },
] as const;

const content: Bilingual<{
  title: string[];
  subtitle: string;
  emailLabel: string;
  copy: string;
  copied: string;
  send: string;
  handle: string;
  newTab: string;
}> = {
  pt: {
    title: ["Vamos construir", "algo em tempo real?"],
    subtitle: "Aberto a oportunidades como desenvolvedor back-end.",
    emailLabel: "E-mail",
    copy: "Copiar",
    copied: "copiado ✓",
    send: "Enviar e-mail",
    handle: `@${site.handle} em todas as redes`,
    newTab: "(abre em nova aba)",
  },
  en: {
    title: ["Let's build", "something real-time?"],
    subtitle: "Open to back-end developer opportunities.",
    emailLabel: "Email",
    copy: "Copy",
    copied: "copied ✓",
    send: "Send an email",
    handle: `@${site.handle} everywhere`,
    newTab: "(opens in a new tab)",
  },
};

export function Contact({ lang }: { lang: Locale }) {
  const t = content[lang];
  return (
    <section id="contato" className="noise relative overflow-clip">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_65%_70%_at_75%_50%,#000,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_15%_0%,rgb(63_127_232/0.07),transparent)]"
      />
      <Logo className="pointer-events-none absolute -right-[18%] top-1/2 size-[min(85vw,600px)] -translate-y-1/2 opacity-[0.06] sm:-right-[8%] lg:right-[2%]" />

      <Container className="relative flex flex-col gap-12 py-24 sm:gap-16 sm:py-32 lg:py-36">
        <div className="flex flex-col gap-5">
          <RevealText
            lines={t.title}
            className="text-balance font-pixel text-[clamp(2rem,6vw,4.5rem)] leading-[1.06] tracking-[-0.01em] text-fg"
          />
          <Reveal delay={0.25}>
            <p className="text-pretty text-base text-fg-muted sm:text-lg">{t.subtitle}</p>
          </Reveal>
        </div>

        <Reveal delay={0.35} className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <EmailCopy email={site.email} label={t.emailLabel} copy={t.copy} copied={t.copied} />
          <div className="flex flex-col gap-3 xl:items-end">
            <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3 xl:justify-end">
              <Button variant="white" href={`mailto:${site.email}`} arrow>
                {t.send}
              </Button>
              {socials.map((s) => (
                <Button key={s.label} variant="outline" href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  <span aria-hidden className="text-fg-subtle">↗</span>
                  <span className="sr-only">{t.newTab}</span>
                </Button>
              ))}
            </div>
            <p className="font-mono text-xs text-fg-subtle">{t.handle}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
