// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Window};
use window_shadows::set_shadow;
//use std::{thread, time}; //for waiting
use std::fs;
use std::path::Path;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            main_window.center().expect("could not center the window");
            set_shadow(&main_window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![save_image, close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn save_image(path: String, img: Vec<u8>) -> String {

    let img_data: &[u8] = &img;

    let file_path = Path::new(&path);
    let result = match fs::write(file_path, img_data) {
        Ok(()) => String::from("OK"),
        Err(_err) => String::from("ERROR")
    };

    return result;
}

#[tauri::command]
async fn close_splashscreen(window: Window) {
    // Close splashscreen
    window.get_window("splashscreen").expect("no window labeled 'splashscreen' found").close().unwrap();
    // Show main window
    window.get_window("main").expect("no window labeled 'main' found").show().unwrap();
}
