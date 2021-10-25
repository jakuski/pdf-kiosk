"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
var kioskWindow;
var onQuit = function () {
    if (!kioskWindow)
        return electron_1.app.quit();
    kioskWindow.webContents.send("PASSWORD_REQUEST");
};
var createWindow = function () {
    electron_1.globalShortcut.register("CmdOrCtrl+P", function () {
        kioskWindow.webContents.send("PASSWORD_REQUEST");
    });
    electron_1.globalShortcut.register("CmdOrCtrl+Q", onQuit);
    electron_1.globalShortcut.register("alt+f4", onQuit);
    // Create the browser window.
    var mainWindow = new electron_1.BrowserWindow({
        height: 500,
        width: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/loader.html'));
    // Open <a/> tags in browser
    mainWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        electron_1.shell.openExternal(url);
    });
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
electron_1.ipcMain.on("OPEN_KIOSK", function (ev, data) {
    kioskWindow = new electron_1.BrowserWindow({
        kiosk: true,
        fullscreen: true,
        closable: true,
        webPreferences: {
            preload: path.join(__dirname, "kiosk.js")
        }
    });
    kioskWindow.loadFile(data.path);
    kioskWindow.webContents.on("will-navigate", function (e, url) {
        e.preventDefault();
        console.log(url);
        kioskWindow.webContents.send("EXTERNAL_URL_NOT_PERMITTED");
    });
    // https://github.com/electron/electron/issues/18207
    kioskWindow.on("blur", function () {
        kioskWindow.hide();
        kioskWindow.setKiosk(false);
        kioskWindow.moveTop();
        kioskWindow.focus();
        kioskWindow.setKiosk(true);
        kioskWindow.show();
        kioskWindow.focus();
    });
});
electron_1.ipcMain.on("CLOSE_KIOSK", function (ev) {
    if (kioskWindow) {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map