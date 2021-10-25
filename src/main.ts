import { app, BrowserWindow, shell, ipcMain } from 'electron';
import * as path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 500,
    width: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/loader.html'));

  // Open <a/> tags in browser
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("OPEN_KIOSK", (ev, data: KioskTypes.OpenObject) => {
  const kioskWindow = new BrowserWindow({
    kiosk: false,
    webPreferences: {
      preload: path.join(__dirname, "kiosk.js")
    }
  });

  kioskWindow.loadFile(data.path)
})