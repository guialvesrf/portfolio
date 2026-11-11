import { Container } from "./Container";

/** Wrapper de seção com âncora e espaçamento vertical padrão. */
export function Section({ id, children, className = "", containerClassName = "" }: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 lg:py-32 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
