/** Dados pessoais compartilhados entre seções. */
export const site = {
  name: "Guilherme Alves",
  fullName: "Guilherme Alves Rodrigues Ferreira",
  email: "guialves.garf50@hotmail.com",
  handle: "guialvesrf",
  social: {
    github: "https://github.com/guialvesrf",
    linkedin: "https://www.linkedin.com/in/guialvesrf",
    instagram: "https://www.instagram.com/guialvesrf",
  },
} as const;

/** Âncoras das seções, na ordem da página. */
export const nav = {
  pt: [
    { id: "destaques", label: "Destaques" },
    { id: "experiencia", label: "Experiência" },
    { id: "projetos", label: "Projetos" },
    { id: "engenharia", label: "Engenharia" },
    { id: "stack", label: "Stack" },
    { id: "conquistas", label: "Conquistas" },
    { id: "formacao", label: "Formação" },
  ],
  en: [
    { id: "destaques", label: "Highlights" },
    { id: "experiencia", label: "Experience" },
    { id: "projetos", label: "Projects" },
    { id: "engenharia", label: "Engineering" },
    { id: "stack", label: "Stack" },
    { id: "conquistas", label: "Awards" },
    { id: "formacao", label: "Education" },
  ],
} as const;
