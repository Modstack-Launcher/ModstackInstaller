import { useTranslation } from "../i18n/useTranslation";
import type { Lang } from "../i18n/translations";
import "./LangSelector.css";

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "pt", flag: "🇧🇷", label: "PT" },
];

export default function LangSelector() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="lang-selector">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`lang-btn ${lang === l.code ? "active" : ""}`}
          onClick={() => setLang(l.code)}
          title={l.label}
        >
          <span className="lang-flag">{l.flag}</span>
          <span className="lang-label">{l.label}</span>
        </button>
      ))}
    </div>
  );
}