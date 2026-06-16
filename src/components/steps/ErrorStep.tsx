import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "../../i18n/useTranslation";
import "./steps.css";

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorStep({ message, onRetry }: Props) {
  const { t } = useTranslation();
  const handleClose = () => invoke("close_installer");

  return (
    <div className="step-shell anim-fade-up">
      <div className="step-header">
        <h2 className="step-title-lg" style={{ color: "var(--ms-red)" }}>
          {t.error.title}
        </h2>
        <p className="step-subtitle-lg">{t.error.subtitle}</p>
      </div>

      <div className="step-body">
        <div className="error-center">
          <div className="error-icon">⚠️</div>

          <div className="error-box">{message}</div>

          <p style={{ fontSize: 12, color: "var(--ms-text-muted)" }}>
            {t.error.help}{" "}
            <a
              href="https://discord.gg/QmZpUCbn2N"
              onClick={(e) => { e.preventDefault(); invoke("open_url", { url: "https://discord.gg/QmZpUCbn2N" }); }}
              style={{ color: "var(--ms-blue-bright)", cursor: "pointer", textDecoration: "none" }}
            >
              {t.error.discord}
            </a>
          </p>
        </div>
      </div>

      <div className="step-footer">
        <button className="btn btn-ghost" onClick={handleClose}>
          {t.error.close}
        </button>
        <button className="btn btn-primary" onClick={onRetry}>
          {t.error.retry}
        </button>
      </div>
    </div>
  );
}
