import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

/** Moldura dos cards da seção Engenharia: cabeçalho + área do diagrama. */
export function DiagramCard({ index, tag, title, description, chips, wide, children }: {
  index: string;
  tag: string;
  title: string;
  description: string;
  chips: string[];
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={wide ? "lg:col-span-2" : ""}>
      <article className="group flex h-full flex-col border border-line bg-ink-900 transition-colors duration-300 hover:border-line-strong">
        <header className="flex flex-col gap-4 border-b border-line p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
              {index} <span className="text-blue-400">■</span> {tag}
            </span>
            <Badge tone="blue">live</Badge>
          </div>
          <div className={`flex flex-col gap-3 ${wide ? "lg:flex-row lg:items-end lg:justify-between lg:gap-10" : ""}`}>
            <h3 className="font-pixel text-2xl leading-tight text-fg sm:text-[28px]">{title}</h3>
            <p className={`text-pretty text-sm leading-relaxed text-fg-muted sm:text-[15px] ${wide ? "lg:max-w-md" : ""}`}>{description}</p>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <li key={c} className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                {c}
              </li>
            ))}
          </ul>
        </header>
        <div className="relative flex-1 overflow-hidden p-4 sm:p-6">{children}</div>
      </article>
    </Reveal>
  );
}
