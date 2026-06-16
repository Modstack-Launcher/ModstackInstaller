import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import "./steps.css";

interface Props {
  onAccept: () => void;
  onBack: () => void;
}

export default function LicenseStep({ onAccept, onBack }: Props) {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="step-shell anim-fade-up">
      <div className="step-header">
        <h2 className="step-title-lg">{t.license.title}</h2>
        <p className="step-subtitle-lg">{t.license.subtitle}</p>
      </div>

      <div className="step-body">
        <pre className="license-box">{t.license.licenseText}</pre>

        <label className="checkbox-row" onClick={() => setAccepted((v) => !v)}>
          <input type="checkbox" checked={accepted} readOnly />
          <span className="checkbox-label">{t.license.accept}</span>
        </label>
      </div>

      <div className="step-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          {t.license.back}
        </button>
        <button
          className="btn btn-primary"
          onClick={onAccept}
          disabled={!accepted}
        >
          {t.license.acceptBtn}
        </button>
      </div>
    </div>
  );
}
