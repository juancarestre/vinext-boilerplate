"use client";

import { useRouter } from "next/navigation";
import { localeCookieName, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: Props) {
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-2.5 py-1.5 text-xs text-muted-foreground backdrop-blur">
      <span>Language</span>
      <select
        className="cursor-pointer bg-transparent text-xs text-foreground outline-none"
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value;
          document.cookie = `${localeCookieName}=${nextLocale}; Max-Age=31536000; Path=/; SameSite=Lax`;
          router.refresh();
        }}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </label>
  );
}
