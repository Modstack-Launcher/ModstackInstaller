import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import type { InstallMode } from "../../App";
import "./steps.css";

interface Props {
  onNext: (mode: InstallMode) => void;
}

export default function WelcomeStep({ onNext }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<InstallMode>("install");

  const ACTIONS: { key: InstallMode; icon: JSX.Element; title: string; desc: string }[] = [
    {
      key: "install",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.welcome.install.title,
      desc: t.welcome.install.desc,
    },
    {
      key: "repair",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3a4 4 0 11-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 005.4-5.4l-3-3-3 3 1 1 3-3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.welcome.repair.title,
      desc: t.welcome.repair.desc,
    },
    {
      key: "uninstall",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.welcome.uninstall.title,
      desc: t.welcome.uninstall.desc,
    },
  ];

  return (
    <div className="step-shell anim-fade-up">
      <div className="step-header">
        <h2 className="step-title-lg">{t.welcome.title}</h2>
        <p className="step-subtitle-lg">{t.welcome.subtitle}</p>
      </div>

      <div className="step-body">
        <div className="action-grid">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              className={`action-card ${selected === a.key ? "selected" : ""}`}
              onClick={() => setSelected(a.key)}
            >
              <div className="action-card-icon">{a.icon}</div>
              <div className="action-card-title">{a.title}</div>
              <div className="action-card-desc">{a.desc}</div>
            </button>
          ))}
        </div>

        <div className="welcome-banner">
          <div className="welcome-banner-dot" />
          <span>{t.welcome.disclaimer}</span>
        </div>
      </div>

      <div className="step-footer">
        <button className="btn btn-primary" onClick={() => onNext(selected)}>
          {t.welcome.next}
        </button>
      </div>
    </div>
  );
}
