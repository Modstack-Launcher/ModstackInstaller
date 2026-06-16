import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import Sidebar from "./Sidebar";
import type { InstallerStep } from "../App";
import { useTranslation } from "../i18n/useTranslation";
import "./InstallerShell.css";

interface Props {
  step: InstallerStep;
  children: React.ReactNode;
  os?: string;
  javaVersion?: string;
  diskSpace?: string;
}

export default function InstallerShell({ step, children, os, javaVersion, diskSpace }: Props) {
  const { t } = useTranslation();
  const appWindow = getCurrentWindow();

  const minimize = () => appWindow.minimize().catch(() => {});
  const maximize = () => appWindow.toggleMaximize().catch(() => {});
  const close = () => invoke("close_installer").catch(() => {});

  const STEP_ORDER: { key: InstallerStep; num: number; label: string }[] = [
    { key: "welcome",     num: 1, label: t.tabs.welcome },
    { key: "license",     num: 2, label: t.tabs.license },
    { key: "install-dir", num: 3, label: t.tabs.options },
    { key: "installing",  num: 4, label: t.tabs.installing },
    { key: "finish",      num: 5, label: t.tabs.finish },
  ];

  const activeIndex = STEP_ORDER.findIndex((s) => s.key === step);

  return (
    <div className="shell">
      <div className="shell-titlebar" data-tauri-drag-region>
        <div className="shell-titlebar-dots">
          <span className="shell-titlebar-label">{t.titlebar.title}</span>
        </div>
        <div className="shell-window-controls">
          <div className="shell-window-controls">
            <button className="win-btn" onClick={minimize} aria-label="Minimize">
              <svg width="10" height="10" viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" /></svg>
            </button>
            <button className="win-btn" onClick={maximize} aria-label="Maximize">
              <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
            </button>
            <button className="win-btn win-btn-close" onClick={close} aria-label="Close">
              <svg width="10" height="10" viewBox="0 0 10 10"><line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" /><line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="shell-tabs">
        {STEP_ORDER.map((s, i) => {
          const state = step === s.key ? "active" : i < activeIndex ? "done" : "";
          return (
            <div className={`shell-tab ${state}`} key={s.key}>
              <span className="shell-tab-num">
                {i < activeIndex ? "✓" : s.num}
              </span>
              {s.label}
            </div>
          );
        })}
      </div>

      <div className="shell-body">
        <Sidebar step={step} os={os} javaVersion={javaVersion} diskSpace={diskSpace} />
        <div className="shell-content">{children}</div>
      </div>
    </div>
  );
}
