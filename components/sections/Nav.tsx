"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { nav, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Nav({ lang }: { lang: Locale }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = nav[lang];
  const contact = lang === "pt" ? "Contato" : "Contact";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-ink-950/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={`/${lang}`} className="flex items-center gap-2.5" aria-label={site.name}>
          <Logo />
          <span className="font-pixel text-lg leading-none text-fg sm:text-xl">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="text-[13px] text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle lang={lang} hash={hash} />
          <Button href="#contato" variant="outline" size="sm" className="hidden sm:inline-flex">
            {contact}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <span className="relative block h-2.5 w-4">
              <span className={`absolute left-0 h-px w-4 bg-fg transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-4 bg-fg transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-ink-950 lg:hidden"
          >
            <ul className="flex flex-col px-4 py-4 sm:px-6">
              {[...links, { id: "contato", label: contact }].map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 font-pixel text-2xl text-fg"
                  >
                    {l.label}
                    <span className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangToggle({ lang, hash }: { lang: Locale; hash: string }) {
  return (
    <div className="flex h-9 items-center border border-line-strong font-mono text-[11px]" role="group" aria-label="Idioma / Language">
      {(["pt", "en"] as const).map((l) => (
        <Link
          key={l}
          href={`/${l}${hash}`}
          scroll={false}
          aria-current={l === lang ? "true" : undefined}
          className={`grid h-full place-items-center px-2.5 uppercase tracking-wider transition-colors ${
            l === lang ? "bg-fg text-ink-950" : "text-fg-subtle hover:text-fg"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
