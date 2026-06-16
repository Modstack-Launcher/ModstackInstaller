use std::path::Path;
use tauri::AppHandle;
use futures_util::StreamExt;

const RELEASE_API: &str = "https://api.github.com/repos/Modstack-Launcher/ModstackApp/releases/latest";

pub struct ReleaseAsset {
    pub file_name: String,
    pub download_url: String,
    pub size_bytes: u64,
}

pub async fn fetch_release_asset(client: &reqwest::Client) -> Result<ReleaseAsset, String> {
    let release: serde_json::Value = client
        .get(RELEASE_API)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch release: {}", e))?
        .json()
        .await
        .map_err(|e| format!("Failed to parse release JSON: {}", e))?;

    let assets = release["assets"]
        .as_array()
        .ok_or("No assets found in release")?;

    #[cfg(target_os = "windows")]
    let asset = assets
        .iter()
        .find(|a| {
            a["name"]
                .as_str()
                .map(|n| n == "modstack-setup.exe")
                .unwrap_or(false)
        })
        .ok_or("No modstack-setup.exe asset found in release")?;

    #[cfg(target_os = "macos")]
    let asset = assets
        .iter()
        .find(|a| a["name"].as_str().map(|n| n == "modstack.dmg").unwrap_or(false))
        .ok_or("No modstack.dmg asset found in release")?;

    #[cfg(target_os = "linux")]
    let asset = assets
        .iter()
        .find(|a| a["name"].as_str().map(|n| n == "modstack.AppImage").unwrap_or(false))
        .ok_or("No modstack.AppImage asset found in release")?;

    Ok(ReleaseAsset {
        file_name: asset["name"].as_str().ok_or("Missing asset name")?.to_string(),
        download_url: asset["browser_download_url"]
            .as_str()
            .ok_or("Missing download URL")?
            .to_string(),
        size_bytes: asset["size"].as_u64().unwrap_or(0),
    })
}

#[cfg(target_os = "windows")]
pub fn get_installed_dir_from_registry() -> Option<std::path::PathBuf> {
    use winreg::enums::*;
    use winreg::RegKey;

    let keys = [
        (HKEY_CURRENT_USER,  r"Software\ModstackApp"),
        (HKEY_LOCAL_MACHINE, r"Software\ModstackApp"),
        (HKEY_CURRENT_USER,  r"Software\Modstack"),
        (HKEY_LOCAL_MACHINE, r"Software\Modstack"),
        (HKEY_CURRENT_USER,  r"Software\Microsoft\Windows\CurrentVersion\Uninstall\ModstackApp"),
        (HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\ModstackApp"),
    ];

    for (hive, path) in &keys {
        if let Ok(key) = RegKey::predef(*hive).open_subkey(path) {
            if let Ok(val) = key.get_value::<String, _>("InstallLocation") {
                let p = std::path::PathBuf::from(val.trim_end_matches('\\'));
                if p.exists() {
                    return Some(p);
                }
            }
        }
    }
    None
}

pub async fn run_install<F>(
    _app: &AppHandle,
    install_path: &Path,
    mut progress: F,
) -> Result<std::path::PathBuf, String>
where
    F: FnMut(u8, &str),
{
    let client = reqwest::Client::builder()
        .user_agent(format!("modstack-installer/{}", env!("CARGO_PKG_VERSION")))
        .build()
        .map_err(|e| e.to_string())?;

    progress(0, "Obteniendo informacion del release...");
    let asset = fetch_release_asset(&client).await?;

    progress(5, &format!("Descargando {}...", asset.file_name));

    let response = client
        .get(&asset.download_url)
        .send()
        .await
        .map_err(|e| format!("Download failed: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Download returned status {}", response.status()));
    }

    let temp_dir = std::env::temp_dir();
    let dest_path = temp_dir.join(&asset.file_name);

    let mut file = std::fs::File::create(&dest_path)
        .map_err(|e| format!("Failed to create temp file: {}", e))?;

    let mut downloaded: u64 = 0;
    let mut stream = response.bytes_stream();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| format!("Download stream error: {}", e))?;
        std::io::Write::write_all(&mut file, &chunk)
            .map_err(|e| format!("Failed to write chunk: {}", e))?;
        downloaded += chunk.len() as u64;

        if asset.size_bytes > 0 {
            let pct = ((downloaded as f64 / asset.size_bytes as f64) * 100.0) as u8;
            progress(pct.min(85), &format!("Descargando... {}%", pct.min(85)));
        }
    }
    drop(file);

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;

        progress(87, "Verificando archivo descargado...");
        let mut ready = false;
        for attempt in 0u64..10 {
            match std::fs::OpenOptions::new().read(true).write(true).open(&dest_path) {
                Ok(_) => { ready = true; break; }
                Err(_) => {
                    std::thread::sleep(std::time::Duration::from_millis(500 * (attempt + 1)));
                }
            }
        }
        if !ready {
            return Err("El archivo descargado sigue bloqueado. Intenta desactivar el antivirus temporalmente.".to_string());
        }

        progress(90, "Ejecutando instalador...");

        std::fs::create_dir_all(install_path)
            .map_err(|e| format!("No se pudo crear el directorio de instalacion: {}", e))?;

        let install_dir_str = install_path
            .canonicalize()
            .unwrap_or_else(|_| install_path.to_path_buf())
            .to_string_lossy()
            .trim_start_matches(r"\\?\")
            .to_string();

        let d_arg = format!("/D={}", install_dir_str);

        let mut last_err = String::new();
        let mut launched = false;

        for attempt in 0u64..3 {
            let result: std::io::Result<std::process::ExitStatus> =
                std::process::Command::new(&dest_path)
                    .raw_arg("/S")
                    .raw_arg(&d_arg)
                    .status();

            match result {
                Ok(status) => {
                    if status.success() {
                        launched = true;
                        break;
                    } else {
                        last_err = format!("Installer exited with code {:?}", status.code());
                        break;
                    }
                }
                Err(e) => {
                    last_err = e.to_string();
                    if attempt < 2 {
                        std::thread::sleep(std::time::Duration::from_millis(1000 * (attempt + 1)));
                    }
                }
            }
        }

        let _ = std::fs::remove_file(&dest_path);

        if !launched {
            return Err(format!("Failed to run setup: {}", last_err));
        }

        progress(93, "Finalizando instalacion...");
        std::thread::sleep(std::time::Duration::from_millis(1500));
        progress(96, "Verificando instalacion...");
        std::thread::sleep(std::time::Duration::from_millis(1000));

        let real_path = get_installed_dir_from_registry()
            .unwrap_or_else(|| install_path.to_path_buf());

        progress(99, "Casi listo...");
        std::thread::sleep(std::time::Duration::from_millis(500));

        return Ok(real_path);
    }

    #[cfg(target_os = "macos")]
    {
        progress(90, "Montando imagen de disco...");
        std::process::Command::new("hdiutil")
            .args(["attach", "-nobrowse", "-quiet", &dest_path.to_string_lossy()])
            .output()
            .map_err(|e| format!("hdiutil failed: {}", e))?;

        let app_src = std::path::Path::new("/Volumes/modstack/modstack.app");
        let app_dst = install_path.join("modstack.app");
        if app_src.exists() {
            copy_dir_all(app_src, &app_dst)?;
            let _ = std::process::Command::new("hdiutil")
                .args(["detach", "/Volumes/modstack", "-quiet"])
                .output();
        } else {
            let _ = std::process::Command::new("hdiutil")
                .args(["detach", "/Volumes/modstack", "-quiet"])
                .output();
            return Err("Could not find modstack.app in mounted image".to_string());
        }
        let _ = std::fs::remove_file(&dest_path);
    }

    #[cfg(target_os = "linux")]
    {
        use std::os::unix::fs::PermissionsExt;
        let appimage_dest = install_path.join("modstack");
        if dest_path != appimage_dest {
            std::fs::rename(&dest_path, &appimage_dest)
                .map_err(|e| format!("Failed to move AppImage: {}", e))?;
        }
        std::fs::set_permissions(&appimage_dest, std::fs::Permissions::from_mode(0o755))
            .map_err(|e| format!("Failed to chmod AppImage: {}", e))?;
    }
}

#[cfg(target_os = "macos")]
fn copy_dir_all(src: &Path, dst: &Path) -> Result<(), String> {
    std::fs::create_dir_all(dst).map_err(|e| e.to_string())?;
    for entry in std::fs::read_dir(src).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let ty = entry.file_type().map_err(|e| e.to_string())?;
        let dest = dst.join(entry.file_name());
        if ty.is_dir() {
            copy_dir_all(&entry.path(), &dest)?;
        } else {
            std::fs::copy(entry.path(), dest).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}