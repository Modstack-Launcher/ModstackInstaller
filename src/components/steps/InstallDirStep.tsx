import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import type { InstallConfig, InstallMode } from "../../App";
import { useTranslation } from "../../i18n/useTranslation";
import "./steps.css";

interface Props {
  mode: InstallMode;
  config: InstallConfig;
  onChange: (partial: Partial<InstallConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} MB`;
  return `${Math.round(bytes / 1_048_576)} MB`;
}

export default function InstallDirStep({ mode, config, onChange, onNext, onBack }: Props) {
  const { t } = useTranslation();
  const [os, setOs] = useState<string>("");
  const [diskSpace, setDiskSpace] = useState<string>("");
  const [launcherSize, setLauncherSize] = useState<string>("...");
  const [diskLoading, setDiskLoading] = useState(false);

  const isInstall = mode === "install";

  useEffect(() => {
    Promise.resolve(platform()).then((p) => setOs(p));

    if (isInstall) {
      invoke<string>("get_default_install_dir").then((dir) => {
        if (!config.installDir) onChange({ installDir: dir });
      });
      invoke<number>("get_launcher_size")
        .then((bytes) => setLauncherSize(formatBytes(bytes)))
        .catch(() => setLauncherSize("~9 MB"));
    }
  }, []);

  useEffect(() => {
    if (!config.installDir) return;
    setDiskLoading(true);
    invoke<string>("get_disk_space", { path: config.installDir })
      .then((space) => { setDiskSpace(space); setDiskLoading(false); })
      .catch(() => { setDiskSpace(""); setDiskLoading(false); });
  }, [config.installDir]);

  const pickFolder = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: isInstall ? t.installDir.dialogTitle : t.installDir.dialogTitleFind,
    });
    if (selected && typeof selected === "string") {
      if (isInstall) {
        const separator = selected.includes("\\") ? "\\" : "/";
        const withSubfolder = selected.endsWith("Modstack App")
          ? selected
          : `${selected}${separator}Modstack App`;
        onChange({ installDir: withSubfolder });
      } else {
        onChange({ installDir: selected });
      }
    }
  };

  const isWindows = os === "windows";

  const title = isInstall ? t.installDir.title :
    mode === "repair" ? t.installDir.titleRepair : t.installDir.titleUninstall;
  const subtitle = isInstall ? t.installDir.subtitle :
    mode === "repair" ? t.installDir.subtitleRepair : t.installDir.subtitleUninstall;

  return (
    <div className="step-shell anim-fade-up">
      <div className="step-header">
        <h2 className="step-title-lg">{title}</h2>
        <p className="step-subtitle-lg">{subtitle}</p>
      </div>

      <div className="step-body">
        <div className="install-section">
          <div className="install-section-label">
            {isInstall ? t.installDir.folderLabel : t.installDir.folderLabelFind}
          </div>
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              value={config.installDir}
              onChange={(e) => onChange({ installDir: e.target.value })}
              placeholder={isInstall ? t.installDir.placeholder : t.installDir.placeholderFind}
            />
            <button className="btn btn-secondary" onClick={pickFolder}>
              {t.installDir.browse}
            </button>
          </div>
          {config.installDir && (
            <div className="dir-preview">
              <span className="dir-preview-icon">📁</span>
              <span>{config.installDir}</span>
              {diskLoading ? (
                <span style={{ marginLeft: "auto", color: "var(--ms-text-muted)", fontSize: 11 }}>
                  {t.installDir.calculating}
                </span>
              ) : diskSpace ? (
                <span style={{ marginLeft: "auto", color: "var(--ms-text-muted)", fontSize: 11 }}>
                  {diskSpace}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {isInstall && (
          <>
            <div className="divider" />
            <div className="install-section">
              <div className="install-section-label">{t.installDir.optionsLabel}</div>
              {isWindows && (
                <>
                  <label className="checkbox-row" onClick={() => onChange({ createDesktopShortcut: !config.createDesktopShortcut })}>
                    <input type="checkbox" checked={config.createDesktopShortcut} readOnly />
                    <span className="checkbox-label">{t.installDir.desktopShortcut}</span>
                  </label>
                  <label className="checkbox-row" onClick={() => onChange({ createStartMenuShortcut: !config.createStartMenuShortcut })}>
                    <input type="checkbox" checked={config.createStartMenuShortcut} readOnly />
                    <span className="checkbox-label">{t.installDir.startMenu}</span>
                  </label>
                </>
              )}
              <label className="checkbox-row" onClick={() => onChange({ launchAfterInstall: !config.launchAfterInstall })}>
                <input type="checkbox" checked={config.launchAfterInstall} readOnly />
                <span className="checkbox-label">{t.installDir.launchAfter}</span>
              </label>
            </div>

            <div className="info-card" style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "var(--ms-text-muted)" }}>
                <strong style={{ color: "var(--ms-text-dim)" }}>{t.installDir.requiredSpace}</strong>{" "}
                {launcherSize}
                {diskSpace && !diskLoading && (
                  <span style={{ color: "var(--ms-green-dim)", marginLeft: 12 }}>
                    {t.installDir.sufficientSpace}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {!isInstall && (
          <div className="info-card" style={{ marginTop: 8, borderColor: "rgba(231,100,75,0.2)", background: "rgba(231,100,75,0.05)" }}>
            <div style={{ fontSize: 12, color: "var(--ms-text-muted)" }}>
              ⚠️ {mode === "uninstall" ? t.installDir.warningUninstall : t.installDir.warningRepair}
            </div>
          </div>
        )}
      </div>

      <div className="step-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          {t.installDir.back}
        </button>
        <button className="btn btn-primary" onClick={onNext} disabled={!config.installDir}>
          {isInstall ? t.installDir.install :
           mode === "repair" ? t.installDir.repair : t.installDir.uninstall}
        </button>
      </div>
    </div>
  );
}
