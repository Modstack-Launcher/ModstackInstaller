import { invoke } from "@tauri-apps/api/core";
import iconImg from "../assets/icon.png";
import type { InstallerStep } from "../App";
import LangSelector from "./LangSelector";
import { useTranslation } from "../i18n/useTranslation";

interface Props {
  step: InstallerStep;
  os?: string;
  javaVersion?: string;
  diskSpace?: string;
}

export default function Sidebar({ os, javaVersion, diskSpace }: Props) {
  const { t } = useTranslation();
  const osLabel = os === "windows" ? "Windows" : os === "macos" ? "macOS" : os ?? "—";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo-area">
        <img className="sidebar-logo-img" src={iconImg} alt="Modstack" />
        <div>
          <div className="sidebar-logo-name">MODSTACK</div>
          <div className="sidebar-logo-sub">{t.sidebar.officialInstaller}</div>
        </div>
      </div>

      <div className="sidebar-ver">v1.1.5</div>

      {/* System info */}
      <div className="sidebar-section-label">{t.sidebar.system}</div>
      <div className="sidebar-info-row">
        <span>{t.sidebar.os}</span>
        <span className="sidebar-info-val">{osLabel}</span>
      </div>
      <div className="sidebar-info-row">
        <span>{t.sidebar.arch}</span>
        <span className="sidebar-info-val">x64</span>
      </div>
      <div className="sidebar-info-row">
        <span>{t.sidebar.java}</span>
        <span
          className="sidebar-info-val"
          style={{ color: javaVersion ? "var(--ms-green)" : "var(--ms-text-muted)" }}
        >
          {javaVersion ? `${javaVersion} ✓` : "—"}
        </span>
      </div>
      <div className="sidebar-info-row">
        <span>{t.sidebar.space}</span>
        <span className="sidebar-info-val">{diskSpace ?? "—"}</span>
      </div>

      <div className="sidebar-spacer" />

      {/* Bottom: Discord + LangSelector */}
      <div className="sidebar-bottom">
        <button
          className="sidebar-discord-btn"
          onClick={() => invoke("open_url", { url: "https://discord.gg/QmZpUCbn2N" })}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>{t.sidebar.support}</span>
          <svg className="sidebar-discord-arrow" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </button>

        <LangSelector />
      </div>
    </aside>
  );
}
