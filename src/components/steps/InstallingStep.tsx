import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { InstallConfig, InstallMode } from "../../App";
import { useTranslation } from "../../i18n/useTranslation";
import "./steps.css";

interface Props {
  mode: InstallMode;
  config: InstallConfig;
  onDone: () => void;
  onError: (msg: string) => void;
}

interface LogLine {
  text: string;
  kind: "info" | "ok" | "warn" | "error";
}

export default function InstallingStep({ mode, config, onDone, onError }: Props) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [task, setTask] = useState("...");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, kind: LogLine["kind"] = "info") =>
    setLogs((prev) => [...prev, { text, kind }]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    let unlisten1: (() => void) | undefined;
    let unlisten2: (() => void) | undefined;
    let unlisten3: (() => void) | undefined;

    const setup = async () => {
      let finished = false;

      unlisten1 = await listen<{ progress: number; task: string }>(
        "install-progress",
        ({ payload }) => { setProgress(payload.progress); setTask(payload.task); }
      );
      unlisten2 = await listen<{ text: string; kind: string }>(
        "install-log",
        ({ payload }) => addLog(payload.text, payload.kind as LogLine["kind"])
      );
      unlisten3 = await listen<{ success: boolean; error?: string }>(
        "install-done",
        ({ payload }) => {
          if (finished) return;
          finished = true;
          if (payload.success) {
            setProgress(100);
            setTask(t.installing.taskDone);
            setDone(true);
            addLog(t.installing.taskDone, "ok");
            setTimeout(onDone, 1200);
          } else {
            onError(payload.error || "Error desconocido");
          }
        }
      );

      try {
        if (mode === "install") {
          await invoke("run_installation", {
            installDir: config.installDir,
            createDesktopShortcut: config.createDesktopShortcut,
            createStartMenuShortcut: config.createStartMenuShortcut,
          });
        } else if (mode === "repair") {
          await invoke("run_repair", { installDir: config.installDir });
        } else if (mode === "uninstall") {
          await invoke("run_uninstall", { installDir: config.installDir });
        }
      } catch (e: unknown) {
        if (!finished) { finished = true; onError(String(e)); }
      }
    };

    setup();
    return () => { unlisten1?.(); unlisten2?.(); unlisten3?.(); };
  }, []);

  const titleBusy =
    mode === "repair" ? t.installing.titleBusyRepair :
    mode === "uninstall" ? t.installing.titleBusyUninstall :
    t.installing.titleBusy;

  const cardBusy =
    mode === "repair" ? t.installing.cardBusyRepair :
    mode === "uninstall" ? t.installing.cardBusyUninstall :
    t.installing.cardBusy;

  return (
    <div className="installing-root">
      <div className="step-header">
        <h2 className="step-title-lg">{done ? t.installing.titleDone : titleBusy}</h2>
        <p className="step-subtitle-lg">
          {done ? t.installing.subtitleDone : t.installing.subtitleBusy}
        </p>
      </div>

      <div className="installing-card">
        <div className="installing-card-left">
          {done ? (
            <div className="installing-done-icon">✓</div>
          ) : (
            <div className="installing-spinner" />
          )}
        </div>
        <div className="installing-card-right">
          <div className="installing-title">
            {done ? t.installing.cardDone : cardBusy}
          </div>
          <div className="installing-task">{task}</div>
          <div className="installing-progress-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="installing-pct">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <div className="installing-log-wrap">
        <div className="installing-log-label">
          <span className="installing-log-dot" />
          {t.installing.logLabel}
        </div>
        <div className="installing-log" ref={logRef}>
          {logs.length === 0 && (
            <div className="log-line info" style={{ opacity: 0.4 }}>{t.installing.logWaiting}</div>
          )}
          {logs.map((l, i) => (
            <div key={i} className={`log-line ${l.kind}`}>
              <span className="log-prefix">
                {l.kind === "ok" ? "✓" : l.kind === "warn" ? "⚠" : l.kind === "error" ? "✗" : "›"}
              </span>
              {l.text}
            </div>
          ))}
        </div>
      </div>

      <div className="step-footer" style={{ justifyContent: "center" }}>
        <span style={{ fontSize: 12, color: "var(--ms-text-muted)" }}>
          {t.installing.noClose}
        </span>
      </div>
    </div>
  );
}