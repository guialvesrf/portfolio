"use client";

import { useEffect, useRef, useState } from "react";

/** E-mail em mono (link mailto) + botão copiar com feedback por 2s. */
export function EmailCopy({ email, label, copy, copied }: {
  email: string;
  label: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // sem Clipboard API (http, permissão negada): o link mailto continua ali.
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 2000);
  };

  return (
    <div className="flex w-full flex-col gap-3 border border-line-strong bg-ink-900/70 p-4 backdrop-blur-sm sm:w-fit sm:p-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">{label}</span>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={`mailto:${email}`}
          className="font-mono text-[15px] text-fg underline-offset-4 transition-colors hover:text-blue-300 hover:underline sm:text-lg"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={onCopy}
          className={`inline-flex h-10 min-w-[8.5rem] items-center justify-center gap-2 border px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ${
            done ? "border-green-500/40 bg-green-950 text-green-500" : "border-line-strong text-fg-muted hover:border-fg-subtle hover:text-fg"
          }`}
        >
          {done ? copied : copy}
        </button>
      </div>
      <span aria-live="polite" className="sr-only">
        {done ? copied : ""}
      </span>
    </div>
  );
}
