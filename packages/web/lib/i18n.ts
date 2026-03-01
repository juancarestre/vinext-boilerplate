export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const localeCookieName = "locale";
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && locales.includes(value as Locale);
}

export function localeTag(locale: Locale) {
  return locale === "es" ? "es-ES" : "en-US";
}
