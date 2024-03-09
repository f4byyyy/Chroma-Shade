import { appWindow } from './node_modules/@tauri-apps/api/window.js';

document.getElementById('titlebar-minimize').addEventListener('click', () => appWindow.minimize());
document.getElementById('titlebar-maximize').addEventListener('click', async () => {

    await appWindow.isMaximized().then((isMaximized) => {
        if(!isMaximized) {
            document.getElementById('maximize-icon').style.display = 'none';
            document.getElementById('maximized-icon').style.display = 'block';
        } else {
            document.getElementById('maximize-icon').style.display = 'block';
            document.getElementById('maximized-icon').style.display = 'none';
        }
    });

    appWindow.toggleMaximize();
});
document.getElementById('titlebar-close').addEventListener('click', () => appWindow.close());
  