export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export const hasLocale = (l: string): l is Locale =>
  (locales as readonly string[]).includes(l);

/** Conteúdo bilíngue co-localizado em cada seção: `const t = content[lang]`. */
export type Bilingual<T> = Record<Locale, T>;
