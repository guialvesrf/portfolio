import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Engineering } from "@/components/sections/Engineering";
import { Stack } from "@/components/sections/Stack";
import { Achievements } from "@/components/sections/Achievements";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { StepDivider } from "@/components/ui/StepDivider";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <Nav lang={lang} />
      <main>
        <Hero lang={lang} />
        <Highlights lang={lang} />
        <StepDivider />
        <Experience lang={lang} />
        <Projects lang={lang} />
        <StepDivider />
        <Engineering lang={lang} />
        <StepDivider />
        <Stack lang={lang} />
        <Achievements lang={lang} />
        <Education lang={lang} />
        <StepDivider />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
