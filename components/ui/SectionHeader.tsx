import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";

/** Eyebrow + H2 pixel revelado por palavra + parágrafo. */
export function SectionHeader({ eyebrow, title, description, align = "left", action }: {
  eyebrow: string;
  title: string[];
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${center ? "items-center text-center md:flex-col md:items-center" : ""}`}>
      <div className={`flex max-w-2xl flex-col gap-5 ${center ? "items-center" : "items-start"}`}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <RevealText
          lines={title}
          className="font-pixel text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.08] tracking-[-0.01em] text-fg"
        />
        {description && (
          <Reveal delay={0.25}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-[17px]">{description}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.35} className="shrink-0">{action}</Reveal>}
    </div>
  );
}
