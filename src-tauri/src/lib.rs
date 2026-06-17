mod commands;
mod installer;
mod java;

use commands::{
    close_installer, get_default_install_dir, get_disk_space, get_java_version, get_launcher_size,
    launch_modstack, open_url, run_installation, run_repair, run_uninstall, get_installed_dir,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_default_install_dir,
            get_disk_space,
            get_java_version,
            get_launcher_size,
            run_installation,
            launch_modstack,
            close_installer,
            open_url,
            run_repair,
            run_uninstall,
            get_installed_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running modstack installer");
}