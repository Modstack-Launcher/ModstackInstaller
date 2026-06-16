interface Props {
  step: number;
  total: number;
}

const LABELS = ["Welcome", "License", "Install Location", "Installing", "Done"];

export default function TitleBar({ step, total }: Props) {
  return (
    <div className="titlebar">
      <div className="titlebar-logo">
        <svg className="titlebar-icon" viewBox="0 0 24 24" fill="none">
          <rect x="2"  y="8"  width="8" height="8" rx="2" fill="#4b77e7" opacity="0.95"/>
          <rect x="7"  y="5"  width="8" height="8" rx="2" fill="#6b93ff" opacity="0.8"/>
          <rect x="12" y="8"  width="8" height="8" rx="2" fill="#3a5fc4" opacity="0.7"/>
        </svg>
        Modstack Installer
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`step-dot ${i + 1 === step ? "active" : i + 1 < step ? "done" : ""}`}
            title={LABELS[i]}
          />
        ))}
      </div>
    </div>
  );
}
