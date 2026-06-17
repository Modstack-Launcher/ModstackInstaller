use std::path::{Path, PathBuf};
use tauri::AppHandle;

pub async fn detect_or_install_java(
    _app: &AppHandle,
    install_path: &Path,
) -> Result<PathBuf, String> {
    if let Some(java) = find_system_java() {
        return Ok(java);
    }

    let bundled = install_path.join("runtime").join("bin/java.exe");
    if bundled.exists() {
        return Ok(bundled);
    }

    Err("Java 21+ not found. The launcher will download it on first run.".to_string())
}

/// Returns the major version of a system-installed Java 21+ if present (e.g. "21").
pub fn detect_java_version() -> Option<String> {
    let java = find_system_java()?;
    get_java_version(&java).ok().map(|v| v.to_string())
}

fn find_system_java() -> Option<PathBuf> {
    let candidates = [
        std::env::var("JAVA_HOME").ok().map(|h| PathBuf::from(h).join("bin/java.exe")),
        Some(PathBuf::from("C:/Program Files/Eclipse Adoptium/jdk-21/bin/java.exe")),
        Some(PathBuf::from("C:/Program Files/Java/jdk-21/bin/java.exe")),
        Some(PathBuf::from("C:/Program Files/Microsoft/jdk-21.0.0.35-hotspot/bin/java.exe")),
    ];
    for candidate in candidates.into_iter().flatten() {
        if candidate.exists() {
            if let Ok(v) = get_java_version(&candidate) {
                if v >= 21 {
                    return Some(candidate);
                }
            }
        }
    }

    None
}

fn get_java_version(java: &Path) -> Result<u32, String> {
    let out = std::process::Command::new(java)
        .arg("-version")
        .output()
        .map_err(|e| e.to_string())?;

    let stderr = String::from_utf8_lossy(&out.stderr);
    let stdout = String::from_utf8_lossy(&out.stdout);
    let combined = format!("{}{}", stderr, stdout);

    let re = regex::Regex::new(r#"version "(\d+)"#).map_err(|e| e.to_string())?;
    if let Some(cap) = re.captures(&combined) {
        if let Ok(major) = cap[1].parse::<u32>() {
            return Ok(major);
        }
    }

    let re2 = regex::Regex::new(r#"version "1\.(\d+)"#).map_err(|e| e.to_string())?;
    if let Some(cap) = re2.captures(&combined) {
        if let Ok(major) = cap[1].parse::<u32>() {
            return Ok(major);
        }
    }

    Err("Could not parse Java version".to_string())
}
