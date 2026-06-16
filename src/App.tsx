import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { platform } from "@tauri-apps/plugin-os";
import SplashScreen from "./components/SplashScreen";
import InstallerShell from "./components/InstallerShell";
import WelcomeStep from "./components/steps/WelcomeStep";
import LicenseStep from "./components/steps/LicenseStep";
import InstallDirStep from "./components/steps/InstallDirStep";
import InstallingStep from "./components/steps/InstallingStep";
import FinishStep from "./components/steps/FinishStep";
import ErrorStep from "./components/steps/ErrorStep";

export type InstallerStep =
  | "splash"
  | "welcome"
  | "license"
  | "install-dir"
  | "installing"
  | "finish"
  | "error";

export type InstallMode = "install" | "repair" | "uninstall";

export interface InstallConfig {
  installDir: string;
  createDesktopShortcut: boolean;
  createStartMenuShortcut: boolean;
  launchAfterInstall: boolean;
}

const DEFAULT_CONFIG: InstallConfig = {
  installDir: "",
  createDesktopShortcut: true,
  createStartMenuShortcut: true,
  launchAfterInstall: true,
};

export default function App() {
  const [step, setStep] = useState<InstallerStep>("splash");
  const [mode, setMode] = useState<InstallMode>("install");
  const [config, setConfig] = useState<InstallConfig>(DEFAULT_CONFIG);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [os, setOs] = useState<string>("");
  const [javaVersion, setJavaVersion] = useState<string>("");
  const [diskSpace, setDiskSpace] = useState<string>("");

  useEffect(() => {
    try { setOs(platform()); } catch(_) {}
    invoke<string>("get_java_version").then(setJavaVersion).catch(() => {});
  }, []);

  useEffect(() => {
    if (!config.installDir) return;
    invoke<string>("get_disk_space", { path: config.installDir })
      .then(setDiskSpace)
      .catch(() => {});
  }, [config.installDir]);

  const goTo = (s: InstallerStep) => setStep(s);
  const handleError = (msg: string) => { setErrorMessage(msg); setStep("error"); };

  const handleModeSelect = async (selectedMode: InstallMode) => {
    setMode(selectedMode);
    if (selectedMode === "install") {
      goTo("license");
    } else {
      try {
        const foundDir = await invoke<string | null>("get_installed_dir");
        if (foundDir) {
          setConfig((prev) => ({ ...prev, installDir: foundDir }));
          goTo("installing");
        } else {
          goTo("install-dir");
        }
      } catch {
        goTo("install-dir");
      }
    }
  };

  return (
    <div className="installer-root">
      {step === "splash" && (
        <SplashScreen
          onDone={() => goTo("welcome")}
          version="1.1.5"
          commitHash="a1b2c3d"
        />
      )}

      <InstallerShell step={step} os={os} javaVersion={javaVersion} diskSpace={diskSpace}>
        {step === "welcome" && (
          <WelcomeStep onNext={handleModeSelect} />
        )}
        {step === "license" && (
          <LicenseStep onAccept={() => goTo("install-dir")} onBack={() => goTo("welcome")} />
        )}
        {step === "install-dir" && (
          <InstallDirStep
            mode={mode}
            config={config}
            onChange={(c) => setConfig({ ...config, ...c })}
            onNext={() => goTo("installing")}
            onBack={() => goTo("welcome")}
          />
        )}
        {step === "installing" && (
          <InstallingStep
            mode={mode}
            config={config}
            onDone={() => goTo("finish")}
            onError={handleError}
          />
        )}
        {step === "finish" && <FinishStep config={config} mode={mode} />}
        {step === "error" && (
          <ErrorStep
            message={errorMessage}
            onRetry={() => mode === "install" ? goTo("install-dir") : goTo("installing")}
          />
        )}
      </InstallerShell>
    </div>
  );
}
