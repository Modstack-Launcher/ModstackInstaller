import { useEffect, useState } from "react";
import iconImg from "../assets/icon.png";
import { useTranslation } from "../i18n/useTranslation";
import "./SplashScreen.css";

interface Props {
  onDone: () => void;
  version?: string;
  commitHash?: string;
}

export default function SplashScreen({ onDone, version, commitHash }: Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 500);
    const t2 = setTimeout(() => setPhase("out"), 2100);
    const t3 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`splash ${phase}`}>
      <div className="splash-glow" />
      <div className="splash-grid" />

      <div className="splash-center">
        <div className="splash-icon">
          <img src={iconImg} alt="Modstack" width="80" height="80" />
        </div>
        <div className="splash-wordmark">
          <span className="splash-word-mod">MOD</span>
          <span className="splash-word-stack">STACK</span>
        </div>
        <div className="splash-tagline">{t.splash.tagline}</div>
        {version && (
          <div className="splash-version">v{version}{commitHash ? ` · ${commitHash}` : ""}</div>
        )}
      </div>

      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  );
}
