import { app, BrowserWindow, shell, ipcMain, Menu, globalShortcut } from 'electron';
import * as path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const blankMenu = new Menu();
app.applicationMenu = blankMenu;

let kioskWindow: BrowserWindow;
let mainWindow: BrowserWindow;

const onQuit = () => {
  if (!kioskWindow) return app.quit();
  kioskWindow.webContents.send("PASSWORD_REQUEST")
}

const createWindow = (): void => {
  [
    "CmdOrCtrl+P", // Cross platform way of opening password modal.
    "CmdOrCtrl+Q" // MacOS quit window shortcut.
  ].forEach(shortcut => {
    globalShortcut.register(shortcut, onQuit);
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 550,
    width: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.setMenu(blankMenu);
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/loader.html'));

  // Open <a/> tags in browser
  mainWindow.webContents.on('new-window', function (e, url) {
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
  kioskWindow = new BrowserWindow({
    kiosk: true,
    fullscreen: true,
    closable: false,
    webPreferences: {
      preload: path.join(__dirname, "kiosk.js")
    }
  });

  kioskWindow.setMenu(blankMenu);
  kioskWindow.setMenuBarVisibility(false);

  kioskWindow.loadFile(data.path);

  kioskWindow.webContents.on("will-navigate", function (e, url) {
    e.preventDefault();
  
    console.log(url)
    kioskWindow.webContents.send("EXTERNAL_URL_NOT_PERMITTED")
  });

  // https://github.com/electron/electron/issues/18207
  kioskWindow.on("blur", () => {
    kioskWindow.focus();
  });

  // Disables Alt+F4
  kioskWindow.on("close", ev => {
    ev.preventDefault();
  });
});

ipcMain.on("CLOSE_KIOSK", () => {
  if (kioskWindow) {
    kioskWindow.destroy();
  }
});