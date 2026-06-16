import { createContext, useContext, useState, type ReactNode } from "react";
import { type Lang, type Translations, translations } from "./translations";

interface I18nContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const I18nCtx = createContext<I18nContext>({
  lang: "es",
  setLang: () => {},
  t: translations.es,
});

function detectLang(): Lang {
  const saved = localStorage.getItem("ms_installer_lang") as Lang | null;
  if (saved && saved in translations) return saved;

  const nav = navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("pt")) return "pt";
  if (nav.startsWith("es")) return "es";
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("ms_installer_lang", l);
  };

  return (
    <I18nCtx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nCtx);
}