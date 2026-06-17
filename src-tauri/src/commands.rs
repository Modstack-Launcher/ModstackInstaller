use std::path::PathBuf;
use tauri::{AppHandle, Emitter};

use crate::installer::{run_install, fetch_release_asset, get_installed_dir_from_registry};
use crate::java::{detect_or_install_java, detect_java_version};

#[tauri::command]
pub fn get_default_install_dir() -> String {
    let local_app_data = std::env::var("LOCALAPPDATA")
        .unwrap_or_else(|_| "C:\\Users\\User\\AppData\\Local".to_string());
    format!("{}\\Modstack App", local_app_data)
}

#[tauri::command]
pub fn get_disk_space(path: String) -> Result<String, String> {
    let existing = {
        let p = std::path::Path::new(&path);
        let mut current = p;
        loop {
            if current.exists() {
                break current.to_string_lossy().to_string();
            }
            match current.parent() {
                Some(parent) => current = parent,
                None => break path.clone(),
            }
        }
    };

    use std::os::windows::ffi::OsStrExt;
    let path_wide: Vec<u16> = std::ffi::OsStr::new(&existing)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect();
    let mut free_bytes: u64 = 0;
    let ret = unsafe {
        windows_sys::Win32::Storage::FileSystem::GetDiskFreeSpaceExW(
            path_wide.as_ptr(),
            &mut free_bytes,
            std::ptr::null_mut(),
            std::ptr::null_mut(),
        )
    };
    if ret == 0 {
        return Err("Could not read disk space".to_string());
    }
    Ok(format_bytes(free_bytes))
}

fn format_bytes(bytes: u64) -> String {
    const GB: u64 = 1_073_741_824;
    const MB: u64 = 1_048_576;
    if bytes >= GB {
        format!("{:.1} GB libres", bytes as f64 / GB as f64)
    } else {
        format!("{} MB libres", bytes / MB)
    }
}

#[tauri::command]
pub fn get_java_version() -> Option<String> {
    detect_java_version()
}

#[tauri::command]
pub async fn get_launcher_size() -> Result<u64, String> {
    let client = reqwest::Client::builder()
        .user_agent(format!("modstack-installer/{}", env!("CARGO_PKG_VERSION")))
        .build()
        .map_err(|e| e.to_string())?;
    let asset = fetch_release_asset(&client).await?;
    Ok(asset.size_bytes)
}

#[tauri::command]
pub async fn run_installation(
    app: AppHandle,
    install_dir: String,
    _create_desktop_shortcut: bool,
    _create_start_menu_shortcut: bool,
) -> Result<String, String> {
    let install_path = PathBuf::from(&install_dir);

    let emit = |progress: u32, task: &str| {
        let _ = app.emit("install-progress", serde_json::json!({ "progress": progress, "task": task }));
    };
    let log = |text: &str, kind: &str| {
        let _ = app.emit("install-log", serde_json::json!({ "text": text, "kind": kind }));
    };

    emit(15, "Verificando Java...");
    log("Buscando Java 21+...", "info");
    match detect_or_install_java(&app, &install_path).await {
        Ok(java_path) => log(&format!("Java encontrado: {}", java_path.display()), "ok"),
        Err(e) => {
            log(&format!("Advertencia: {}", e), "warn");
            log("Continuando — el launcher se encargara de Java si es necesario", "warn");
        }
    }

    emit(30, "Descargando Modstack Launcher...");
    log("Obteniendo ultimo release de GitHub...", "info");

    let real_install_path = run_install(&app, &install_path, |p, t| {
        emit(30 + (p as u32 * 60 / 100), t);
        log(t, "info");
    })
    .await
    .map_err(|e| {
        let _ = app.emit("install-done", serde_json::json!({ "success": false, "error": e }));
        e
    })?;

    let real_dir = real_install_path.to_string_lossy().to_string();
    emit(100, "Instalacion completa!");
    log("Modstack Launcher instalado correctamente!", "ok");
    let _ = app.emit("install-done", serde_json::json!({
        "success": true,
        "install_dir": real_dir
    }));

    Ok(real_dir)
}

#[tauri::command]
pub fn launch_modstack(install_dir: String) -> Result<(), String> {
    let install_path = PathBuf::from(&install_dir);
    let exe = install_path.join("ModstackApp.exe");

    if !exe.exists() {
        if let Some(reg_path) = get_installed_dir_from_registry() {
            let reg_exe = reg_path.join("ModstackApp.exe");
            if reg_exe.exists() {
                return std::process::Command::new(&reg_exe)
                    .spawn()
                    .map(|_| ())
                    .map_err(|e| format!("Failed to launch: {}", e));
            }
        }

        return Err(format!(
            "Launcher no encontrado en: {}\n\nVerifica que la instalacion completo correctamente.",
            exe.display()
        ));
    }

    std::process::Command::new(&exe)
        .spawn()
        .map_err(|e| format!("Failed to launch: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn close_installer(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
pub fn open_url(url: String) -> Result<(), String> {
    std::process::Command::new("cmd")
        .args(["/C", "start", "", &url])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn run_repair(app: AppHandle) -> Result<(), String> {
    let emit = |progress: u32, task: &str| {
        let _ = app.emit("install-progress", serde_json::json!({ "progress": progress, "task": task }));
    };
    let log = |text: &str, kind: &str| {
        let _ = app.emit("install-log", serde_json::json!({ "text": text, "kind": kind }));
    };

    emit(5, "Buscando instalación existente...");
    log("Buscando directorio de instalación...", "info");

    let install_path = get_installed_dir_from_registry()
        .ok_or_else(|| {
            let _ = app.emit("install-done", serde_json::json!({ "success": false, "error": "No se encontró una instalación de Modstack. Instálalo primero." }));
            "No se encontró instalación".to_string()
        })?;

    log(&format!("Instalación encontrada: {}", install_path.display()), "ok");
    emit(20, "Descargando última versión...");

    run_install(&app, &install_path, |p, t| {
        emit(20 + (p as u32 * 75 / 100), t);
        log(t, "info");
    })
    .await
    .map_err(|e| {
        let _ = app.emit("install-done", serde_json::json!({ "success": false, "error": e }));
        e
    })?;

    emit(100, "¡Reparación completa!");
    log("Modstack Launcher reparado correctamente.", "ok");
    let _ = app.emit("install-done", serde_json::json!({ "success": true }));
    Ok(())
}

#[tauri::command]
pub async fn run_uninstall(app: AppHandle) -> Result<(), String> {
    let emit = |progress: u32, task: &str| {
        let _ = app.emit("install-progress", serde_json::json!({ "progress": progress, "task": task }));
    };
    let log = |text: &str, kind: &str| {
        let _ = app.emit("install-log", serde_json::json!({ "text": text, "kind": kind }));
    };

    emit(5, "Buscando instalación...");
    log("Buscando directorio de instalación...", "info");

    let install_path = get_installed_dir_from_registry()
        .ok_or_else(|| {
            let _ = app.emit("install-done", serde_json::json!({ "success": false, "error": "No se encontró una instalación de Modstack." }));
            "No se encontró instalación".to_string()
        })?;

    log(&format!("Instalación encontrada: {}", install_path.display()), "ok");
    emit(20, "Eliminando archivos...");
    log(&format!("Eliminando: {}", install_path.display()), "info");

    std::fs::remove_dir_all(&install_path).map_err(|e| {
        let msg = format!("Error al eliminar archivos: {}", e);
        let _ = app.emit("install-done", serde_json::json!({ "success": false, "error": msg }));
        msg
    })?;

    log("Archivos eliminados.", "ok");
    emit(70, "Limpiando entradas del registro...");

    {
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
            let _ = RegKey::predef(*hive).delete_subkey_all(path);
        }
        log("Registro limpiado.", "ok");

        if let Ok(desktop) = std::env::var("USERPROFILE") {
            let shortcut = PathBuf::from(&desktop).join("Desktop").join("Modstack.lnk");
            let _ = std::fs::remove_file(&shortcut);
        }
        if let Ok(appdata) = std::env::var("APPDATA") {
            let start_menu = PathBuf::from(&appdata)
                .join("Microsoft\\Windows\\Start Menu\\Programs\\Modstack.lnk");
            let _ = std::fs::remove_file(&start_menu);
        }
    }

    emit(100, "¡Desinstalación completa!");
    log("Modstack Launcher eliminado correctamente.", "ok");
    let _ = app.emit("install-done", serde_json::json!({ "success": true }));
    Ok(())
}

#[tauri::command]
pub fn get_installed_dir() -> Option<String> {
    get_installed_dir_from_registry().map(|p| p.to_string_lossy().to_string())
}
