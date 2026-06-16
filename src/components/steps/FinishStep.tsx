import { invoke } from "@tauri-apps/api/core";
import type { InstallConfig, InstallMode } from "../../App";
import { useTranslation } from "../../i18n/useTranslation";
import "./steps.css";

interface Props {
  config: InstallConfig;
  mode: InstallMode;
}

export default function FinishStep({ config, mode }: Props) {
  const { t } = useTranslation();
  const displayPath = config.installDir.replace(/\\\\/g, "\\");

  const handleLaunch = async () => {
    await invoke("launch_modstack", { installDir: config.installDir });
    await invoke("close_installer");
  };

  const handleClose = async () => {
    await invoke("close_installer");
  };

  const heading =
    mode === "uninstall" ? t.finish.headingUninstall :
    mode === "repair"    ? t.finish.headingRepair :
    t.finish.heading;

  const desc =
    mode === "uninstall" ? t.finish.descUninstall :
    mode === "repair"    ? t.finish.descRepair :
    t.finish.desc;

  return (
    <div className="step-shell anim-fade-up">
      <div className="step-header">
        <h2 className="step-title-lg">{t.finish.title}</h2>
        <p className="step-subtitle-lg">
          {mode === "uninstall" ? t.finish.subtitleUninstall :
           mode === "repair"    ? t.finish.subtitleRepair :
           t.finish.subtitle}
        </p>
      </div>

      <div className="step-body">
        <div className="finish-center">
          <div className="finish-check">{mode === "uninstall" ? "🗑" : "✓"}</div>

          <div>
            <h2 className="step-title" style={{ textAlign: "center", marginBottom: 6 }}>
              {heading}
            </h2>
            <p style={{ color: "var(--ms-text-muted)", fontSize: 13, textAlign: "center" }}>
              {desc}
              {mode === "install" && config.launchAfterInstall && t.finish.descLaunch}
            </p>
          </div>

          {mode !== "uninstall" && (
            <div style={{
              background: "rgba(75,119,231,0.06)",
              border: "1px solid rgba(75,119,231,0.18)",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 12,
              color: "var(--ms-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>📁</span>
              <span style={{ color: "var(--ms-text-dim)", fontFamily: "monospace" }}>{displayPath}</span>
            </div>
          )}
        </div>
      </div>

      <div className="step-footer">
        <button className="btn btn-ghost" onClick={handleClose}>
          {t.finish.close}
        </button>
        {mode === "install" && config.launchAfterInstall && (
          <button className="btn btn-primary" onClick={handleLaunch}>
            {t.finish.launch}
          </button>
        )}
      </div>
    </div>
  );
}
