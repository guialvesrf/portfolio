"use client";

import Image from "next/image";
import { useRef } from "react";

/** Botão + lightbox nativo (`<dialog>`) com o PNG original. Esc, clique fora e botão fecham. */
export function CertificateDialog({ label, title, close, alt }: {
  label: string;
  title: string;
  close: string;
  alt: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex h-11 shrink-0 select-none items-center justify-center gap-2 border border-line-strong bg-ink-950/40 px-5 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg-subtle hover:bg-ink-850 sm:h-12 sm:px-6 sm:text-[15px]"
      >
        <span aria-hidden>↗</span>
        {label}
      </button>
      <dialog
        ref={ref}
        aria-label={title}
        // Clique no ::backdrop chega com target = o próprio <dialog>.
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto max-h-none w-[min(100vw_-_2rem,1200px,(100dvh_-_6rem)*16/9)] max-w-none bg-transparent p-0 text-fg backdrop:bg-ink-950/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4 border border-b-0 border-line bg-ink-900 pl-4">
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{title}</span>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="inline-flex h-11 shrink-0 items-center gap-2 border-l border-line px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted transition-colors hover:bg-ink-850 hover:text-fg"
          >
            {close}
            <span aria-hidden>✕</span>
          </button>
        </div>
        <Image
          src="/certificado-fiap.png"
          alt={alt}
          width={1920}
          height={1080}
          sizes="(min-width: 1264px) 1200px, calc(100vw - 2rem)"
          className="block h-auto w-full border border-line bg-ink-900"
        />
      </dialog>
    </>
  );
}
